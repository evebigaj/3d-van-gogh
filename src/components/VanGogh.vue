<template>
  <div>
    <v-card v-if="smallScreen" class="mt-1" :style="`width: ${paintingWidth}; position: fixed; right: 15px; top: 40px;`">
        <v-select
        v-model="painting"
        :items="paintings"
        item-title="title"
        item-value="fNumber">
        </v-select>
        <v-checkbox label="Show axes" v-model="checkShowAxes"></v-checkbox>
    </v-card>
    <div id="plotContainer" :style="`cursor:${plotCursor}; min-height:${plotHeight}`" @mousedown="togglePlotCursor" @mouseup="togglePlotCursor"></div>
        <v-card v-if="!smallScreen" class="mt-1" :style="`width: ${paintingWidth}; position: fixed; right: 15px; top: 40px;`">
            <v-select
            v-model="painting"
            :items="paintings"
            item-title="title"
            item-value="fNumber">
            </v-select>
            <v-checkbox label="Show axes" v-model="checkShowAxes"></v-checkbox>
            <v-img  :src="`/${fNumber}.jpeg`"></v-img>
        </v-card>

        <v-icon icon="mdi:mdi-information" color="info" style="position: fixed; right: 15px; bottom: 15px;" @click="toggleShowInfo"></v-icon>
        <!-- <v-dialog
        v-model="showInfo"
        width="auto"
        style="position: fixed; right: 15px; bottom: 15px;"
        > -->
        <div v-if="showInfo" class="pa-0 mr-1" style="position: fixed; right: 40px; bottom: 15px;">

                    This is a rendering of Van Gogh's paintings in <a href="https://en.wikipedia.org/wiki/CIELAB_color_space">CIELAB color space</a>. <strong>Questions/comments</strong>? eve.bigaj at gmail dot com
        </div>    

    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useDisplay } from 'vuetify'

import { make3dPlot } from '/src/utils/scatterplot.js'


let painting = ref({
    title: 'Starry Night',
    fNumber: 'F 612'
})

let fNumber = computed( () => {

    if(typeof(painting.value) === 'string') {
        return painting.value
    }
    else {
        return painting.value.fNumber
    }
})

let paintingJson = computed(() => `/${fNumber.value}.json`)

let  paintings = ref([
    {
        title: `Fisherman's Wife on the Beach (1882)`,
        fNumber: 'F 6'
    },
    {
        title: 'Peasant Burning Weeds (1883)',
        fNumber: 'F 20'
    },
    {
        title: 'Weaver Arranging Threads (1884)',
        fNumber: 'F 35'
    },
    {
        title: 'Wood Gatherers in the Snow (1884)',
        fNumber: 'F 43'
    },
    {
        title: 'Peasant Woman Taking Her Meal (1885)',
        fNumber: 'F 72'
    },
    {
        title: 'Head of a Woman (1885)',
        fNumber: 'F 269r'
    },
    {
        title: 'The Potato Eaters (1885)',
        fNumber: 'F 82'
    },
    {
        title: 'Portrait of a Woman with Red Ribbon (1885)',
        fNumber: 'F 207'
    },
    {
        title: 'Plaster Statuette of a Female Torso (1886)',
        fNumber: 'F 216a'
    },
    {
        title: 'Agostina Segatori Sitting in the Café du Tambourin (1887)',
        fNumber: 'F 370'
    },
    {
        title: 'The Langlois Bridge at Arles (1888)',
        fNumber: 'F 571'
    },
    {
        title: 'Café Terrace at Night (1888)',
        fNumber: 'F 467'
    },
    {
        title: 'Self-Portrait (Dedicated to Paul Gauguin) (1888)',
        fNumber: 'F 476'
    },
    {
        title: 'Still Life: Vase with Fifteen Sunflowers (1889)',
        fNumber: 'F 458'
    },
    {
        title: 'Self-Portrait  with Bandaged Ear and Pipe (1889)',
        fNumber: 'F 529'
    },
    {
        title: 'The Starry Night (1889)',
        fNumber: 'F 612'
    },
    {
        title: 'Still Life: Vase with Pink Roses (1890)',
        fNumber: 'F 681'
    },
    {
        title: 'Still Life: Vase with Irises Against a Yellow Background (1890)',
        fNumber: 'F 678'
    },
    {
        title: 'Field with Poppies (1890)',
        fNumber: 'F 636'
    },
    {
        title: 'Wheatfield with Crows (1890)',
        fNumber: 'F 779'
    }
])

let plotContainerId = ref('plotContainer')
let showAxes = ref(false)
let checkShowAxes = ref(false)

watch(checkShowAxes, (newValue) => {
    showAxes = newValue
})

// const theme = useTheme()
// let backgroundColor = theme.current._value.colors.background


watch(paintingJson, (newPaintingJson) => {
    make3dPlot(newPaintingJson, plotContainerId.value, checkShowAxes.value)
})

watch(checkShowAxes, newShowAxes => {
    make3dPlot(paintingJson.value, plotContainerId.value, newShowAxes)
})

const { name } = useDisplay()
let smallScreen = computed(()=>{
    return name.value === 'xs'})

const paintingWidth = computed(() => { 
    return smallScreen.value? '95vw' : '10vw'
})
const plotHeight = computed(() => {
    return smallScreen.value? '70vh' : '100vh'
})

let plotCursor = ref('grab')

function togglePlotCursor() {
    let grab = (plotCursor.value === 'grab')
    plotCursor.value = grab? 'grabbing' : 'grab'
}



onMounted(() => {
    make3dPlot(paintingJson.value, plotContainerId.value, showAxes.value)
})

let showInfo = ref(false)

function toggleShowInfo() {
    showInfo.value = !showInfo.value
}


</script>

<style>

.v-input__details {
    display: none !important;
}

</style>
