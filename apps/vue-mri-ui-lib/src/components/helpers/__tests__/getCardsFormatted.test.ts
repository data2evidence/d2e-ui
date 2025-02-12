import { getCardsFormatted, BoolContainer } from '../getCardsFormatted'

const mockGetText = (returnValue: any) => jest.fn((key: string) => returnValue)
const mockGetAttributeName = (returnValue: any) => jest.fn((configPath: string, type: string) => returnValue)
const mockGetAttributeType = (returnValue: any) => jest.fn((configPath: string) => returnValue)
const mockGetDomainValues = (returnValue: any) => jest.fn((type: string) => returnValue)

describe('getCardsFormatted', () => {
  it('should work when no cohort definition cards', () => {
    expect(
      getCardsFormatted({
        boolContainers: [],
        getText: mockGetText(null),
        getAttributeName: mockGetAttributeName(null),
        getAttributeType: mockGetAttributeType(null),
        getDomainValues: mockGetDomainValues(null),
      })
    ).toStrictEqual([])
  })
  it('should work in case 1', () => {
    const input: BoolContainer[] = [
      {
        content: [
          {
            configPath: 'patient',
            instanceNumber: 0,
            instanceID: 'patient',
            name: 'Basic Data',
            inactive: false,
            isEntry: false,
            isExit: false,
            type: 'FilterCard',
            attributes: {
              content: [
                {
                  configPath: 'patient.attributes.Age',
                  instanceID: 'patient.attributes.Age',
                  type: 'Attribute',
                  constraints: {
                    content: [],
                    type: 'BooleanContainer',
                    op: 'OR',
                  },
                },
                {
                  configPath: 'patient.attributes.Gender_concept_name',
                  instanceID: 'patient.attributes.Gender_concept_name',
                  type: 'Attribute',
                  constraints: {
                    content: [],
                    type: 'BooleanContainer',
                    op: 'OR',
                  },
                },
              ],
              type: 'BooleanContainer',
              op: 'AND',
            },
            advanceTimeFilter: null,
          },
        ],
        type: 'BooleanContainer',
        op: 'OR',
      },
      {
        content: [
          {
            configPath: 'patient.interactions.conditionoccurrence',
            instanceNumber: 1,
            instanceID: 'patient.interactions.conditionoccurrence.1',
            name: 'Condition Occurrence A',
            inactive: false,
            isEntry: true,
            isExit: false,
            type: 'FilterCard',
            attributes: {
              content: [
                {
                  configPath: 'patient.interactions.conditionoccurrence.attributes.condition_occ_concept_name',
                  instanceID: 'patient.interactions.conditionoccurrence.1.attributes.condition_occ_concept_name',
                  type: 'Attribute',
                  constraints: {
                    content: [],
                    type: 'BooleanContainer',
                    op: 'OR',
                  },
                },
                {
                  configPath: 'patient.interactions.conditionoccurrence.attributes.conditionconceptset',
                  instanceID: 'patient.interactions.conditionoccurrence.1.attributes.conditionconceptset',
                  type: 'Attribute',
                  constraints: {
                    content: [],
                    type: 'BooleanContainer',
                    op: 'OR',
                  },
                },
              ],
              type: 'BooleanContainer',
              op: 'AND',
            },
            advanceTimeFilter: null,
          },
        ],
        type: 'BooleanContainer',
        op: 'OR',
      },
    ]
    const expected = [
      {
        content: [
          {
            visibleAttributes: [],
            name: 'Basic Data',
          },
        ],
      },
      {
        content: [
          {
            visibleAttributes: [],
            name: 'Condition Occurrence A',
          },
        ],
      },
    ]

    expect(
      getCardsFormatted({
        boolContainers: input,
        getText: mockGetText(null),
        getAttributeName: mockGetAttributeName('Condition concept set'),
        getAttributeType: mockGetAttributeType('conceptSet'),
        getDomainValues: mockGetDomainValues({
          values: [
            {
              value: '94491f99-18ff-4dbc-a185-e4fb56fb6ada',
              text: 'test21',
              score: 1,
            },
          ],
          isLoading: false,
          isLoaded: true,
          loadedStatus: 'HAS_RESULTS',
        }),
      })
    ).toStrictEqual(expected)
  })
  it('should work in case 2', () => {
    const input: BoolContainer[] = [
      {
        content: [
          {
            configPath: 'patient',
            instanceNumber: 0,
            instanceID: 'patient',
            name: 'Basic Data',
            inactive: false,
            isEntry: false,
            isExit: false,
            type: 'FilterCard',
            attributes: {
              content: [
                {
                  configPath: 'patient.attributes.Age',
                  instanceID: 'patient.attributes.Age',
                  type: 'Attribute',
                  constraints: {
                    content: [],
                    type: 'BooleanContainer',
                    op: 'OR',
                  },
                },
                {
                  configPath: 'patient.attributes.Gender_concept_name',
                  instanceID: 'patient.attributes.Gender_concept_name',
                  type: 'Attribute',
                  constraints: {
                    content: [],
                    type: 'BooleanContainer',
                    op: 'OR',
                  },
                },
              ],
              type: 'BooleanContainer',
              op: 'AND',
            },
            advanceTimeFilter: null,
          },
        ],
        type: 'BooleanContainer',
        op: 'OR',
      },
      {
        content: [
          {
            configPath: 'patient.interactions.death',
            instanceNumber: 1,
            instanceID: 'patient.interactions.death.1',
            name: 'Death A',
            inactive: false,
            isEntry: true,
            isExit: false,
            type: 'FilterCard',
            attributes: {
              content: [
                {
                  configPath: 'patient.interactions.death.attributes.deathtypeconceptset',
                  instanceID: 'patient.interactions.death.1.attributes.deathtypeconceptset',
                  type: 'Attribute',
                  constraints: {
                    content: [],
                    type: 'BooleanContainer',
                    op: 'OR',
                  },
                },
              ],
              type: 'BooleanContainer',
              op: 'AND',
            },
            advanceTimeFilter: null,
          },
        ],
        type: 'BooleanContainer',
        op: 'OR',
      },
    ]
    const expected = [
      {
        content: [
          {
            visibleAttributes: [],
            name: 'Basic Data',
          },
        ],
      },
      {
        content: [
          {
            visibleAttributes: [],
            name: 'Death A',
          },
        ],
      },
    ]
    expect(
      getCardsFormatted({
        boolContainers: input,
        getText: mockGetText(null),
        getAttributeName: mockGetAttributeName('Condition concept set'),
        getAttributeType: mockGetAttributeType('conceptSet'),
        getDomainValues: mockGetDomainValues({
          values: [
            {
              value: '94491f99-18ff-4dbc-a185-e4fb56fb6ada',
              text: 'test21',
              score: 1,
            },
          ],
          isLoading: false,
          isLoaded: true,
          loadedStatus: 'HAS_RESULTS',
        }),
      })
    ).toStrictEqual(expected)
  })
  it('should work in case 3', () => {
    const input: BoolContainer[] = [
      {
        content: [
          {
            configPath: 'patient',
            instanceNumber: 0,
            instanceID: 'patient',
            name: 'Basic Data',
            inactive: false,
            isEntry: false,
            isExit: false,
            type: 'FilterCard',
            attributes: {
              content: [
                {
                  configPath: 'patient.attributes.Age',
                  instanceID: 'patient.attributes.Age',
                  type: 'Attribute',
                  constraints: {
                    content: [],
                    type: 'BooleanContainer',
                    op: 'OR',
                  },
                },
                {
                  configPath: 'patient.attributes.Gender_concept_name',
                  instanceID: 'patient.attributes.Gender_concept_name',
                  type: 'Attribute',
                  constraints: {
                    content: [],
                    type: 'BooleanContainer',
                    op: 'OR',
                  },
                },
              ],
              type: 'BooleanContainer',
              op: 'AND',
            },
            advanceTimeFilter: null,
          },
        ],
        type: 'BooleanContainer',
        op: 'OR',
      },
      {
        content: [
          {
            configPath: 'patient.interactions.conditionoccurrence',
            instanceNumber: 1,
            instanceID: 'patient.interactions.conditionoccurrence.1',
            name: 'Condition Occurrence A',
            inactive: false,
            isEntry: false,
            isExit: false,
            type: 'FilterCard',
            attributes: {
              content: [
                {
                  configPath: 'patient.interactions.conditionoccurrence.attributes.condition_occ_concept_name',
                  instanceID: 'patient.interactions.conditionoccurrence.1.attributes.condition_occ_concept_name',
                  type: 'Attribute',
                  constraints: {
                    content: [],
                    type: 'BooleanContainer',
                    op: 'OR',
                  },
                },
                {
                  configPath: 'patient.interactions.conditionoccurrence.attributes.conditionconceptset',
                  instanceID: 'patient.interactions.conditionoccurrence.1.attributes.conditionconceptset',
                  type: 'Attribute',
                  constraints: {
                    content: [
                      {
                        type: 'Expression',
                        operator: '=',
                        value: '94491f99-18ff-4dbc-a185-e4fb56fb6ada',
                      },
                    ],
                    type: 'BooleanContainer',
                    op: 'OR',
                  },
                },
              ],
              type: 'BooleanContainer',
              op: 'AND',
            },
            advanceTimeFilter: null,
          },
        ],
        type: 'BooleanContainer',
        op: 'OR',
      },
    ]
    const expected = [
      {
        content: [
          {
            visibleAttributes: [],
            name: 'Basic Data',
          },
        ],
      },
      {
        content: [
          {
            visibleAttributes: [
              {
                name: 'Condition concept set',
                visibleConstraints: ['test21'],
              },
            ],
            name: 'Condition Occurrence A',
          },
        ],
      },
    ]

    expect(
      getCardsFormatted({
        boolContainers: input,
        getText: mockGetText(null),
        getAttributeName: mockGetAttributeName('Condition concept set'),
        getAttributeType: mockGetAttributeType('conceptSet'),
        getDomainValues: mockGetDomainValues({
          values: [
            {
              value: '94491f99-18ff-4dbc-a185-e4fb56fb6ada',
              text: 'test21',
              score: 1,
            },
          ],
          isLoading: false,
          isLoaded: true,
          loadedStatus: 'HAS_RESULTS',
        }),
      })
    ).toStrictEqual(expected)
  })
})

