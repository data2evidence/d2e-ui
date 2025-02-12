export type BoolContainer = {
  content: {
    configPath: string
    instanceNumber: number
    instanceID: string
    name: string
    inactive: boolean
    isEntry: boolean
    isExit: boolean
    type: string
    attributes: {
      type: string
      op: string
      content: {
        configPath: string
        instanceID: string
        type: string
        constraints: {
          type: string
          op: string
          content: {
            content?: {
              operator: string
              value: string
            }[]
            type: string
            operator: string
            value: string
          }[]
        }
      }[]
    }
    content?: { attributes: { content: {}[] } }
    op?: string
    advanceTimeFilter: any
  }[]
  type: string
  op: string
}

export const getCardsFormatted = ({
  boolContainers,
  getText,
  getAttributeName,
  getAttributeType,
  getDomainValues,
}: {
  boolContainers: BoolContainer[]
  getText: (key: string) => string | undefined
  getAttributeName: (configPath: string, type: string) => string | undefined
  getAttributeType: (configPath: string) => string | undefined
  getDomainValues: (type: string) => { values: { value: string; text: string }[] | undefined } | undefined
}) => {
  const returnObj: {
    content: {
      visibleAttributes: any[]
      name: string
    }[]
  }[] = []
  for (let i = 0; i < boolContainers.length; i += 1) {
    try {
      if (boolContainers[i].content.length > 0) {
        const content: {
          visibleAttributes: any[]
          name: string
        }[] = []
        for (let ii = 0; ii < boolContainers[i].content.length; ii += 1) {
          const visibleAttributes = []
          let attributes = boolContainers[i].content[ii].attributes
          let filterCardName =
            !boolContainers[i].content[ii].name && boolContainers[i].content[ii].instanceID === 'patient'
              ? getText('MRI_PA_FILTERCARD_TITLE_BASIC_DATA')
              : boolContainers[i].content[ii].name
          if (boolContainers[i].content[ii].op && boolContainers[i].content[ii].op === 'NOT') {
            // Excluded filtercard
            attributes = boolContainers[i].content[ii].content[0].attributes
            filterCardName = `${boolContainers[i].content[ii].content[0].name} (${getText('MRI_PA_LABEL_EXCLUDED')})`
          }
          for (let iii = 0; iii < attributes.content.length; iii += 1) {
            if (attributes.content[iii].constraints.content && attributes.content[iii].constraints.content.length > 0) {
              const name = getAttributeName(attributes.content[iii].configPath, 'list')
              const isConceptSet = getAttributeType(attributes.content[iii].configPath) === 'conceptSet'
              const visibleConstraints = []
              const constraints = attributes.content[iii].constraints
              for (let iv = 0; iv < constraints.content.length; iv += 1) {
                if (constraints.content[iv].content) {
                  for (let v = 0; v < constraints.content[iv].content.length; v += 1) {
                    visibleConstraints.push(
                      `${constraints.content[iv].content[v].operator}${constraints.content[iv].content[v].value}`
                    )
                  }
                } else if (constraints.content[iv].operator === '=') {
                  if (isConceptSet) {
                    const conceptSets = getDomainValues('conceptSets')
                    const conceptSetName = conceptSets?.values?.find(
                      set => set.value === constraints.content[iv].value
                    )?.text
                    visibleConstraints.push(conceptSetName || constraints.content[iv].value)
                  } else {
                    visibleConstraints.push(constraints.content[iv].value)
                  }
                } else {
                  visibleConstraints.push(`${constraints.content[iv].operator}${constraints.content[iv].value}`)
                }
              }
              const attributeObj = {
                name,
                visibleConstraints,
              }
              visibleAttributes.push(attributeObj)
            }
          }
          const filterCardObj = {
            visibleAttributes,
            name: `${filterCardName}`,
          }
          content.push(filterCardObj)
        }
        const boolContainerObj = {
          content,
        }
        returnObj.push(boolContainerObj)
      }
    } finally {
      // Handle Incorrect Bookmark Formatting
    }
  }
  return returnObj
}

