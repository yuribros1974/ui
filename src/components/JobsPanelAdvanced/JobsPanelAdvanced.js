import React, { useReducer, useState } from 'react'
import PropTypes from 'prop-types'

import JobsPanelAdvancedView from './JobsPanelAdvancedView'

import { useMode } from '../../hooks/mode.hook'

import {
  initialState,
  advancedActions,
  jobsPanelAdvancedReducer
} from './jobsPanelAdvancedReducer'
import { panelActions } from '../JobsPanel/panelReducer'

const JobsPanelAdvanced = ({
  panelDispatch,
  panelState,
  secretSources,
  setNewJobSecretSources
}) => {
  const [advancedState, advancedDispatch] = useReducer(
    jobsPanelAdvancedReducer,
    initialState
  )
  const [validation, setValidation] = useState({
    secretsSourceValue: true
  })
  const { isStagingMode } = useMode()

  const handleAddNewItem = () => {
    let data = {}
    const isValid =
      advancedState.newSecret.source.length > 0 && validation.secretsSourceValue

    if (isValid) {
      data = {
        kind: advancedState.newSecret.kind,
        source: advancedState.newSecret.source
      }

      const generatedTableData = {
        isDefault: false,
        data
      }

      setNewJobSecretSources([...secretSources, { ...data }])
      panelDispatch({
        type: panelActions.SET_PREVIOUS_PANEL_DATA_SECRET_SOURCES,
        payload: [
          ...panelState.previousPanelData.tableData.secretSources,
          generatedTableData
        ]
      })
      panelDispatch({
        type: panelActions.SET_TABLE_DATA_SECRET_SOURCES,
        payload: [...panelState.tableData.secretSources, generatedTableData]
      })
      advancedDispatch({
        type: advancedActions.SET_ADD_NEW_SECRET,
        payload: false
      })
      advancedDispatch({
        type: advancedActions.REMOVE_NEW_SECRET_DATA
      })
    }

    setValidation(state => ({
      ...state,
      secretsSourceValue:
        advancedState.newSecret.source.length > 0 &&
        validation.secretsSourceValue
    }))
  }

  const handleEditItems = index => {
    const newData = [...secretSources]
    newData[index] = {
      kind:
        advancedState.selectedSecret.newKind ||
        advancedState.selectedSecret.data.kind,
      source: advancedState.selectedSecret.data.source
    }
    const newTableData = [...panelState.tableData.secretSources]
    newTableData[index].data = {
      kind:
        advancedState.selectedSecret.newKind ||
        advancedState.selectedSecret.data.kind,
      source: advancedState.selectedSecret.data.source
    }

    setNewJobSecretSources(newData)
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_SECRET_SOURCES,
      payload: newTableData
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_SECRET_SOURCES,
      payload: newTableData
    })
    advancedDispatch({
      type: advancedActions.SET_SELECTED_ENVIRONMENT_VARIABLE,
      payload: {}
    })
  }

  const handleDeleteItems = (item, index) => {
    setNewJobSecretSources(
      secretSources.filter((dataItem, dataIndex) => dataIndex !== index)
    )
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_SECRET_SOURCES,
      payload: panelState.previousPanelData.tableData.secretSources.filter(
        (dataItem, dataIndex) => dataIndex !== index
      )
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_SECRET_SOURCES,
      payload: panelState.tableData.secretSources.filter(
        (dataItem, dataIndex) => dataIndex !== index
      )
    })
  }

  const handleResetForm = () => {
    advancedDispatch({
      type: advancedActions.SET_ADD_NEW_SECRET,
      payload: false
    })
    advancedDispatch({
      type: advancedActions.REMOVE_NEW_SECRET_DATA
    })
    setValidation({
      secretsSourceValue: true
    })
  }

  return (
    <JobsPanelAdvancedView
      advancedDispatch={advancedDispatch}
      advancedState={advancedState}
      handleAddNewItem={handleAddNewItem}
      handleDeleteItems={handleDeleteItems}
      handleEditItems={handleEditItems}
      handleResetForm={handleResetForm}
      isStagingMode={isStagingMode}
      panelDispatch={panelDispatch}
      panelState={panelState}
      setValidation={setValidation}
      validation={validation}
    />
  )
}

JobsPanelAdvanced.propTypes = {
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  secretSources: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setNewJobSecretSources: PropTypes.func.isRequired
}

export default JobsPanelAdvanced
