import { buildJSON } from '../postProcessPatientListData'

describe('buildJSON', () => {
  test('Data for basic patient list should be processed correctly', () => {
    expect(buildJSON(inputData1)).toEqual(expectedResult1)
  })
})

export const inputData1 = [
  {
    entity: 'patient',
    data: [
      {
        'patient.attributes.Race': 'White',
        'patient.attributes.Age': 99,
        'patient.attributes.County': '26950',
        'patient.attributes.Ethnicity': 'Not Hispanic or Latino',
        'patient.attributes.Gender': 'MALE',
        'patient.attributes.State': 'MO',
        'patient.attributes.dateOfBirth': '1923-05-01',
        'patient.attributes.dateOfDeath': 'NoValue',
        'patient.attributes.ethnicityconceptcode': 'Not Hispanic',
        'patient.attributes.ethnicityconceptid': 38003564,
        'patient.attributes.genderconceptcode': 'M',
        'patient.attributes.genderconceptid': 8507,
        'patient.attributes.monthOfBirth': 5,
        'patient.attributes.pid': '1',
        'patient.attributes.raceconceptcode': '5',
        'patient.attributes.raceconceptid': 8527,
        'patient.attributes.yearOfBirth': 1923,
      },
      {
        'patient.attributes.Race': 'White',
        'patient.attributes.Age': 79,
        'patient.attributes.County': '39230',
        'patient.attributes.Ethnicity': 'Not Hispanic or Latino',
        'patient.attributes.Gender': 'MALE',
        'patient.attributes.State': 'PA',
        'patient.attributes.dateOfBirth': '1943-01-01',
        'patient.attributes.dateOfDeath': 'NoValue',
        'patient.attributes.ethnicityconceptcode': 'Not Hispanic',
        'patient.attributes.ethnicityconceptid': 38003564,
        'patient.attributes.genderconceptcode': 'M',
        'patient.attributes.genderconceptid': 8507,
        'patient.attributes.monthOfBirth': 1,
        'patient.attributes.pid': '2',
        'patient.attributes.raceconceptcode': '5',
        'patient.attributes.raceconceptid': 8527,
        'patient.attributes.yearOfBirth': 1943,
      },
      {
        'patient.attributes.Race': 'White',
        'patient.attributes.Age': 86,
        'patient.attributes.County': '39280',
        'patient.attributes.Ethnicity': 'Not Hispanic or Latino',
        'patient.attributes.Gender': 'FEMALE',
        'patient.attributes.State': 'PA',
        'patient.attributes.dateOfBirth': '1936-09-01',
        'patient.attributes.dateOfDeath': 'NoValue',
        'patient.attributes.ethnicityconceptcode': 'Not Hispanic',
        'patient.attributes.ethnicityconceptid': 38003564,
        'patient.attributes.genderconceptcode': 'F',
        'patient.attributes.genderconceptid': 8532,
        'patient.attributes.monthOfBirth': 9,
        'patient.attributes.pid': '3',
        'patient.attributes.raceconceptcode': '5',
        'patient.attributes.raceconceptid': 8527,
        'patient.attributes.yearOfBirth': 1936,
      },
    ],
  },
]

export const expectedResult1 = [
  {
    'patient.attributes.Race': 'White',
    'patient.attributes.Age': 99,
    'patient.attributes.County': '26950',
    'patient.attributes.Ethnicity': 'Not Hispanic or Latino',
    'patient.attributes.Gender': 'MALE',
    'patient.attributes.State': 'MO',
    'patient.attributes.dateOfBirth': '1923-05-01',
    'patient.attributes.dateOfDeath': 'NoValue',
    'patient.attributes.ethnicityconceptcode': 'Not Hispanic',
    'patient.attributes.ethnicityconceptid': 38003564,
    'patient.attributes.genderconceptcode': 'M',
    'patient.attributes.genderconceptid': 8507,
    'patient.attributes.monthOfBirth': 5,
    'patient.attributes.pid': '1',
    'patient.attributes.raceconceptcode': '5',
    'patient.attributes.raceconceptid': 8527,
    'patient.attributes.yearOfBirth': 1923,
  },
  {
    'patient.attributes.Race': 'White',
    'patient.attributes.Age': 79,
    'patient.attributes.County': '39230',
    'patient.attributes.Ethnicity': 'Not Hispanic or Latino',
    'patient.attributes.Gender': 'MALE',
    'patient.attributes.State': 'PA',
    'patient.attributes.dateOfBirth': '1943-01-01',
    'patient.attributes.dateOfDeath': 'NoValue',
    'patient.attributes.ethnicityconceptcode': 'Not Hispanic',
    'patient.attributes.ethnicityconceptid': 38003564,
    'patient.attributes.genderconceptcode': 'M',
    'patient.attributes.genderconceptid': 8507,
    'patient.attributes.monthOfBirth': 1,
    'patient.attributes.pid': '2',
    'patient.attributes.raceconceptcode': '5',
    'patient.attributes.raceconceptid': 8527,
    'patient.attributes.yearOfBirth': 1943,
  },
  {
    'patient.attributes.Race': 'White',
    'patient.attributes.Age': 86,
    'patient.attributes.County': '39280',
    'patient.attributes.Ethnicity': 'Not Hispanic or Latino',
    'patient.attributes.Gender': 'FEMALE',
    'patient.attributes.State': 'PA',
    'patient.attributes.dateOfBirth': '1936-09-01',
    'patient.attributes.dateOfDeath': 'NoValue',
    'patient.attributes.ethnicityconceptcode': 'Not Hispanic',
    'patient.attributes.ethnicityconceptid': 38003564,
    'patient.attributes.genderconceptcode': 'F',
    'patient.attributes.genderconceptid': 8532,
    'patient.attributes.monthOfBirth': 9,
    'patient.attributes.pid': '3',
    'patient.attributes.raceconceptcode': '5',
    'patient.attributes.raceconceptid': 8527,
    'patient.attributes.yearOfBirth': 1936,
  },
]
