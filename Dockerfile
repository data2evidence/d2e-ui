FROM node:18.14.0-alpine AS base-build

RUN apk add --update python3 py3-pip build-base git openssh-client

WORKDIR /usr/src/services/app/alp-ui

COPY ./yarn.lock ./yarn.lock
COPY ./package.json ./package.json
COPY ./plugins/sample-superadmin-page/package.json ./plugins/sample-superadmin-page/package.json
COPY ./plugins/sample-researcher-study/package.json ./plugins/sample-researcher-study/package.json
COPY ./libs/portal-components/package.json ./libs/portal-components/package.json
COPY ./libs/portal-plugin/package.json ./libs/portal-plugin/package.json
COPY ./apps/mapping/package.json ./apps/mapping/package.json
COPY ./apps/chp-ps-ui/package.json ./apps/chp-ps-ui/package.json
COPY ./apps/portal/package.json ./apps/portal/package.json
COPY ./apps/analysis/package.json ./apps/analysis/package.json
COPY ./apps/superadmin/package.json ./apps/superadmin/package.json
COPY ./apps/vue-mri-ui-lib/package.json ./apps/vue-mri-ui-lib/package.json
COPY ./apps/jobs/package.json ./apps/jobs/package.json
COPY ./apps/mri-pa-ui/package.json ./apps/mri-pa-ui/package.json
COPY ./apps/flow/package.json ./apps/flow/package.json

COPY ./nx.json ./nx.json

ENV GIT_SSH_COMMAND='ssh -Tvv'

# This is a dummy folder to copy over as its used for different purpose in GHA temporarily

RUN --mount=type=ssh mkdir -p -m 700 ~/.ssh/ &&  \
    ssh-keyscan github.com >> ~/.ssh/known_hosts && \
    yarn install --network-timeout 1000000 --frozen-lockfile

COPY .github /root/
COPY ./.cert ./.cert
COPY ./resources ./resources

FROM base-build AS mri-vue-build

COPY ./apps/vue-mri-ui-lib ./apps/vue-mri-ui-lib

RUN --mount=type=cache,target=build \
    --mount=type=cache,target=dist \
    npx nx build vue-mri

RUN ls -l /usr/src/services/app/alp-ui/resources/

FROM base-build AS portal-base-build

COPY ./libs ./libs

RUN --mount=type=cache,target=build \
    --mount=type=cache,target=dist \
    npx nx build @portal/plugin

RUN --mount=type=cache,target=build \
    --mount=type=cache,target=dist \
    npx nx build @portal/components

RUN ls -l /usr/src/services/app/alp-ui/resources/

FROM portal-base-build AS portal-ui-build

COPY ./apps/portal ./apps/portal

RUN --mount=type=cache,target=build \
    --mount=type=cache,target=dist \
    npx nx build portal

RUN ls -l /usr/src/services/app/alp-ui/resources/

FROM portal-base-build AS mri-portal-build
COPY ./apps/portal ./apps/portal
COPY ./apps/mri-pa-ui ./apps/mri-pa-ui
COPY ./apps/chp-ps-ui ./apps/chp-ps-ui
COPY ./apps/genomics-ui ./apps/genomics-ui

RUN --mount=type=cache,target=build \
    --mount=type=cache,target=dist \
    npx nx build-mri portal

RUN --mount=type=cache,target=build \
    --mount=type=cache,target=dist \
    npx nx build mri-pa-ui

RUN --mount=type=cache,target=build \
    --mount=type=cache,target=dist \
    npx nx build chp-ps-ui

RUN cp -r ./apps/genomics-ui /usr/src/services/app/alp-ui/resources/mri-ui5

RUN ls -l /usr/src/services/app/alp-ui/resources/

FROM portal-base-build AS superadmin-ui-build

COPY ./apps/superadmin ./apps/superadmin

RUN --mount=type=cache,target=build \
    --mount=type=cache,target=dist \
    npx nx build superadmin
RUN ls -l /usr/src/services/app/alp-ui/resources/

FROM portal-base-build AS flow-ui-build
COPY ./apps/flow ./apps/flow
COPY ./apps/portal ./apps/portal

RUN --mount=type=cache,target=build \
    --mount=type=cache,target=dist \
    npx nx build flow
RUN ls -l /usr/src/services/app/alp-ui/resources/

FROM portal-base-build AS analysis-ui-build

COPY ./apps/analysis ./apps/analysis

RUN --mount=type=cache,target=build \
    --mount=type=cache,target=dist \
    npx nx build analysis_flow
RUN ls -l /usr/src/services/app/alp-ui/resources/

FROM portal-base-build AS mapping-ui-build
COPY ./apps/mapping ./apps/mapping

RUN --mount=type=cache,target=build \
    --mount=type=cache,target=dist \
    npx nx build mapping
RUN ls -l /usr/src/services/app/alp-ui/resources/

FROM base-build AS ui5-build
COPY . .
COPY ./ui5.yaml ./ui5.yaml

RUN yarn ui5 build -a --clean-dest --dest ./resources/ui5
RUN ls -l /usr/src/services/app/alp-ui/resources/


FROM portal-base-build AS starboard-build
WORKDIR /usr/src/services/app/alp-ui/node_modules/@alp-os/alp-starboard-notebook/packages/starboard-notebook

RUN mkdir /usr/src/services/app/alp-ui/resources/starboard-notebook-base/
RUN cp -r ./dist/. /usr/src/services/app/alp-ui/resources/starboard-notebook-base

RUN ls -l /usr/src/services/app/alp-ui/resources

FROM portal-base-build AS pyqe-build
COPY ./alp-libs/python/pyodidepyqe ./libs/pyodidepyqe

WORKDIR /usr/src/services/app/alp-ui/libs/pyodidepyqe
RUN pip install wheel
RUN make package

RUN cp ./dist/pyodidepyqe-0.0.2-py3-none-any.whl /usr/src/services/app/alp-ui/resources

RUN ls -l /usr/src/services/app/alp-ui/resources

FROM base-build AS jobs-build

COPY ./apps/jobs ./apps/jobs

RUN --mount=type=cache,target=build \
    --mount=type=cache,target=dist \
    npx nx build jobs

RUN ls -l /usr/src/services/app/alp-ui/resources

FROM portal-base-build AS pystrategus-build
COPY ./alp-libs/python/pystrategus ./libs/pystrategus

WORKDIR /usr/src/services/app/alp-ui/libs/pystrategus
RUN pip install wheel
RUN make package

RUN cp ./dist/pystrategus-0.0.1-py3-none-any.whl /usr/src/services/app/alp-ui/resources

RUN ls -l /usr/src/services/app/alp-ui/resources

FROM base-build AS final-build

WORKDIR /usr/src/
RUN mkdir -p services/app/alp-ui/resources/
COPY --from=mri-vue-build /usr/src/services/app/alp-ui/resources/mri services/app/alp-ui/resources/mri
COPY --from=portal-ui-build /usr/src/services/app/alp-ui/resources/portal services/app/alp-ui/resources/portal
COPY --from=mri-portal-build /usr/src/services/app/alp-ui/resources/mri-ui5 services/app/alp-ui/resources/mri-ui5
COPY --from=superadmin-ui-build /usr/src/services/app/alp-ui/resources/superadmin services/app/alp-ui/resources/superadmin
COPY --from=flow-ui-build /usr/src/services/app/alp-ui/resources/flow services/app/alp-ui/resources/flow
COPY --from=analysis-ui-build /usr/src/services/app/alp-ui/resources/analysis services/app/alp-ui/resources/analysis
COPY --from=mapping-ui-build /usr/src/services/app/alp-ui/resources/mapping services/app/alp-ui/resources/mapping
COPY --from=ui5-build /usr/src/services/app/alp-ui/resources/ui5 services/app/alp-ui/resources/ui5
COPY --from=starboard-build /usr/src/services/app/alp-ui/resources/starboard-notebook-base services/app/alp-ui/resources/starboard-notebook-base
COPY --from=pyqe-build /usr/src/services/app/alp-ui/resources/pyodidepyqe-0.0.2-py3-none-any.whl services/app/alp-ui/resources/starboard-notebook-base
COPY --from=jobs-build /usr/src/services/app/alp-ui/resources/jobs services/app/alp-ui/resources/jobs
COPY --from=pystrategus-build /usr/src/services/app/alp-ui/resources/pystrategus-0.0.1-py3-none-any.whl services/app/alp-ui/resources/starboard-notebook-base

FROM caddy:2.8-alpine AS final

USER root

RUN apk add --update --upgrade openssl zlib
RUN rm -rf /usr/local/lib/node_modules/npm

WORKDIR /home/docker

# ARG 
# GIT COMMIT Passed during docker build time
ARG GIT_COMMIT_ARG
# ENV
ENV GIT_COMMIT=$GIT_COMMIT_ARG

COPY --from=final-build /usr/src/services/app/alp-ui/resources/ ui-files/

# Ignore check if its run for http tests
RUN for NAME in mri mri-ui5 ui5 portal superadmin flow analysis mapping starboard-notebook-base; do \
    DIR=ui-files/${NAME}; \
    echo TEST $DIR created ...; \
    ls -d "${DIR}" || exit 1; \
    done
