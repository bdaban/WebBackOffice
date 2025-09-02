import { defineNuxtPlugin } from '#app'
import { use as echartsUse } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart, BarChart, HeatmapChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent, GridComponent, TitleComponent, VisualMapComponent } from 'echarts/components'
import VChart from 'vue-echarts'

export default defineNuxtPlugin((nuxtApp) => {
	echartsUse([CanvasRenderer, LineChart, PieChart, BarChart, HeatmapChart, TooltipComponent, LegendComponent, GridComponent, TitleComponent, VisualMapComponent])
	nuxtApp.vueApp.component('VChart', VChart)
})


