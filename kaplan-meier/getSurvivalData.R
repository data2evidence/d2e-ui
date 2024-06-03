library(CDMConnector)
library(CohortSurvival)
library(dplyr)
library(ggplot2)
library(rjson)

cdm <- CohortSurvival::mockMGUS2cdm()

# cdm$mgus_diagnosis %>%
#   glimpse()

# cdm$progression %>%
#   glimpse()

# cdm$death_cohort %>%
#   glimpse()

MGUS_death <- estimateSingleEventSurvival(cdm,
  targetCohortTable = "mgus_diagnosis",
  outcomeCohortTable = "death_cohort"
)

MGUS_death |> 
  glimpse()

plot = plotSurvival(MGUS_death)

plot_data <- ggplot_build(plot)$data[[1]]

my_json = toJSON(plot_data)
write(my_json, "myJSON.json")