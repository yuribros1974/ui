import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import MlChart from '../../common/Chart/MlChart'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { generateStatistics } from './detailsStatistics.util'
import { getHistogramChartConfig } from '../../utils/getHistogramChartConfig'

import './detailsStatistics.scss'
import colors from 'igz-controls/scss/colors.scss'

const DetailsStatistics = ({ selectedItem }) => {
  const statistics = generateStatistics(selectedItem)
  const chartConfig = useMemo(getHistogramChartConfig, [])
  const headers = Object.entries(statistics[0]).map(([label, value]) => ({
    label,
    type: value.type,
    hidden: statistics.every(statisticsItem => statisticsItem[label].hidden)
  }))

  return (
    <div className="details-statistics">
      <div className="details-statistics__table">
        <div className="details-statistics__table-wrapper">
          <div className="details-statistics__table-header">
            {headers.map(({ label, type, hidden }) => {
              const statisticsHeaderClassNames = classnames(
                'details-statistics__table-item',
                'header-item',
                `statistics-cell__${label}`,
                `statistics-cell__type_${type}`,
                hidden && 'statistics-cell_hidden'
              )

              return (
                <div className={statisticsHeaderClassNames} key={label}>
                  <Tooltip template={<TextTooltipTemplate text={label} />}>
                    {type !== 'icon' && label}
                  </Tooltip>
                </div>
              )
            })}
          </div>
          {statistics.map((statisticsItem, statisticsItemIndex) => {
            return (
              <div
                key={statisticsItem.name.value + statisticsItemIndex}
                className="details-statistics__table-row"
              >
                {Object.values(statisticsItem).map((statisticsValue, index) => {
                  const statisticsItemClassNames = classnames(
                    'details-statistics__table-item',
                    `statistics-cell__${headers[index].label}`,
                    `statistics-cell__type_${headers[index].type}`,
                    headers[index].hidden && 'statistics-cell_hidden'
                  )

                  let config = {}

                  if (statisticsValue.type === 'chart') {
                    config = {
                      ...chartConfig,
                      data: {
                        labels: statisticsValue.value[1],
                        datasets: [
                          {
                            data: statisticsValue.value[0],
                            showLine: false,
                            backgroundColor: [colors.amethyst]
                          }
                        ]
                      },
                      options: {
                        ...chartConfig.options,
                        scales: {
                          ...chartConfig.options.scales,
                          y: {
                            ...chartConfig.options.scales.y,
                            display: true,
                            min: 0,
                            max: Math.max(...statisticsValue.value[0]),
                            ticks: {
                              ...chartConfig.options.scales.y.ticks,
                              stepSize: Math.max(...statisticsValue.value[0])
                            }
                          }
                        }
                      }
                    }
                  }

                  return (
                    <div
                      key={Date.now() + index}
                      className={statisticsItemClassNames}
                    >
                      {statisticsValue.type.match(/icon/) &&
                        !statisticsValue.hidden &&
                        statisticsValue.value}
                      {statisticsValue.type === 'chart' &&
                        statisticsValue.value[1]?.length > 0 && (
                          <MlChart config={config} />
                        )}
                      {!statisticsValue.type.match(/icon|chart/) && (
                        <Tooltip
                          className="data-ellipsis"
                          template={
                            <TextTooltipTemplate
                              text={`${statisticsValue.tooltip ??
                                statisticsValue.value}`}
                            />
                          }
                        >
                          {statisticsValue.value}
                        </Tooltip>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

DetailsStatistics.propTypes = {
  selectedItem: PropTypes.shape({}).isRequired
}

export default DetailsStatistics
