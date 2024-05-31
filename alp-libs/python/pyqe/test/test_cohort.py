import pytest
import json
from pyqe.api.cohort import Cohort
from pyqe.api.base import _Api, _AuthApi
from test.mock_object import MockResponse


@pytest.fixture
def setup(monkeypatch):
    monkeypatch.setenv('PYQE_URL', 'http://pyqe.url')
    monkeypatch.setenv('PYQE_STUDY_URL', 'http://pyqe.url')
    monkeypatch.setenv('PYQE_AUTH_TYPE', '0')
    monkeypatch.setenv('PYQE_TLS_CLIENT_CA_CERT_PATH', 'empty')
    monkeypatch.setattr(_Api, '_delete', _delete_cohort)
    monkeypatch.setattr(_Api, '_get', _get_all_cohorts)
    monkeypatch.setattr(_Api, '_post', _create_cohort)
    monkeypatch.setenv('ID_TOKEN', 'Bearer eyJhbGciOiJFUzM4NCIsInR5cCI6ImF0K2p3dCIsImtpZCI6IjhUMHp1NGJRQ0VmVzgyaGVBUE03X25LbDR1UWFiN05KRTR2MzcwQ2loM0EifQ.eyJqdGkiOiJ3OXJjeURiRGczZ0pyS0xZM01Ka28iLCJzdWIiOiJoczJnbDF5bmc4MWoiLCJpYXQiOjE3MTY4ODM5OTIsImV4cCI6MTcxNjg4NzU5Miwic2NvcGUiOiIiLCJjbGllbnRfaWQiOiIxZDZ3dXlkYW55YWl5cGJrY2h4enUiLCJpc3MiOiJodHRwczovL2hvc3QuZG9ja2VyLmludGVybmFsOjMwMDEvb2lkYyIsImF1ZCI6Imh0dHBzOi8vYWxwLWRlZmF1bHQifQ.3Bu9WIMGId9kOOgL-vPzi4r6pJlzMK9tVDDI6B8xoC--lf_i9zCf-aJ5DTU_FmRJSghgs6paACjZr5mU_jTGhI0px6NIVednFzL6eS6rgwOVxASRWB1sAwzS66hKRztm')


def test_init_cohort(setup, monkeypatch):
    # when
    cohort = Cohort(STUDY_ID)

    assert isinstance(cohort, _AuthApi)
    assert cohort.study_id == STUDY_ID


def test_get_all_cohorts(setup):
    # when
    cohort = Cohort(STUDY_ID)

    # Then
    response = cohort.get_all_cohorts()

    assert response == ALL_COHORTS


def test_delete_cohort(setup):
    # when
    cohort = Cohort(STUDY_ID)
    cohortId = 1

    response = cohort.delete_cohort(cohortId)

    assert response == json.dumps("Deleted 1 row from cohort 1")


def test_create_cohort(setup):

    # when
    cohort = Cohort(STUDY_ID)

    cohort_definition = {
        "mriquery": "cohortRequest",
        "name": "my test cohort",
        "description": "hello",
        "syntax": {"ConceptSets": [], "CensorWindow": {}, "InclusionRules": [{"name": "Age", "expression": {"Type": "ALL", "Groups": [], "CriteriaList": [], "DemographicCriteriaList": [{"Age": {"Op": "gt", "Value": 18}}]}}], "QualifiedLimit": {"Type": "First"}, "ExpressionLimit": {"Type": "All"}, "PrimaryCriteria": {"CriteriaList": [{"VisitOccurrence": {"VisitTypeExclude": "false"}}], "ObservationWindow": {"PostDays": 0, "PriorDays": 0}, "PrimaryCriteriaLimit": {"Type": "All"}}, "cdmVersionRange": ">=5.0.0", "CollapseSettings": {"EraPad": 0, "CollapseType": "ERA"}, "CensoringCriteria": []}
    }

    response = cohort.create_cohort(cohort_definition)

    assert response == json.dumps("cohort created")


GET_ALL_COHORTS_PATH = "api/services/cohort"

DELETE_COHORT_PATH = "api/services/cohort?cohortId=1&studyId=studyId"

CREATE_COHORT_PATH = "api/services/cohort"

STUDY_ID = "studyId"

PARAMS = {
    "studyId": STUDY_ID,
    "offset": 0,
    "limit": 0
}

ALL_COHORTS = {'data': [{'id': 1,
                         'patientIds': [1, 2, 3, 4, 5],
                         'name': '67 years old',
                         'description': 'cohort of people which are 50 years old',
                         'creationTimestamp': '2022-09-12T06:30:10',
                         'modificationTimestamp': 'NoValue',
                         'owner': '0c46c73e-c3fb-476a-8c76-3e558a18f2f2'},
                        {'id': 2,
                         'patientIds': [6, 7, 8, 9, 10],
                         'name': '67 years old',
                         'description': 'cohort of people which are 67 years old',
                         'creationTimestamp': '2022-09-12T06:30:10',
                         'modificationTimestamp': 'NoValue',
                         'owner': '0c46c73e-c3fb-476a-8c76-3e558a18f2f2'}],
               'cohortDefinitionCount': 2}

COHORT_DEFINITION = {'mriquery': 'eJxTSs7PyC8qCUotLE0tLlECAC2ABb0=',
                     'name': 'my test cohort',
                     'description': 'hello',
                     'studyId': 'studyId',
                     'syntax': '{"ConceptSets": [], "CensorWindow": {}, "InclusionRules": '
                     '[{"name": "Age", "expression": {"Type": "ALL", "Groups": [], '
                     '"CriteriaList": [], "DemographicCriteriaList": [{"Age": {"Op": '
                     '"gt", "Value": 18}}]}}], "QualifiedLimit": {"Type": "First"}, '
                     '"ExpressionLimit": {"Type": "All"}, "PrimaryCriteria": '
                     '{"CriteriaList": [{"VisitOccurrence": {"VisitTypeExclude": '
                     '"false"}}], "ObservationWindow": {"PostDays": 0, "PriorDays": 0}, '
                     '"PrimaryCriteriaLimit": {"Type": "All"}}, "cdmVersionRange": '
                     '">=5.0.0", "CollapseSettings": {"EraPad": 0, "CollapseType": '
                                '"ERA"}, "CensoringCriteria": []}',
                     'owner': 'hs2gl1yng81j'}


def _get_all_cohorts(auth_api, path, params, basePath):

    assert params == PARAMS
    if path == GET_ALL_COHORTS_PATH:
        return MockResponse(200, ALL_COHORTS)

    return MockResponse(404, None)


def _delete_cohort(auth_api, path):

    if path == DELETE_COHORT_PATH:
        return MockResponse(200, 'Deleted 1 row from cohort 1')

    return MockResponse(404, None)


def _create_cohort(auth_api, path, json, data):

    if path == CREATE_COHORT_PATH:

        assert json == COHORT_DEFINITION
        return MockResponse(200, 'cohort created')

    return MockResponse(404, None)
