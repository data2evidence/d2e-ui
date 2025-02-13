<script setup lang="ts">
const { type, size } = defineProps<{
  type: 'dark' | 'light'
  size: number
}>()
</script>
<template>
  <svg
    :width="`${size}px`"
    :height="`${size}px`"
    :viewBox="`0 0 32 32`"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <g
      v-if="type === 'dark'"
      xmlns="http://www.w3.org/2000/svg"
      id="Page-1"
      stroke="none"
      stroke-width="1"
      fill="navy"
      fill-rule="evenodd"
      xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
      sketch:type="MSPage"
    >
      <g id="Icon-Set-Filled" sketch:type="MSLayerGroup" transform="translate(-102.000000, -1037.000000)" fill="navy">
        <path
          d="M124,1054 L119,1054 L119,1059 C119,1059.55 118.552,1060 118,1060 C117.448,1060 117,1059.55 117,1059 L117,1054 L112,1054 C111.448,1054 111,1053.55 111,1053 C111,1052.45 111.448,1052 112,1052 L117,1052 L117,1047 C117,1046.45 117.448,1046 118,1046 C118.552,1046 119,1046.45 119,1047 L119,1052 L124,1052 C124.552,1052 125,1052.45 125,1053 C125,1053.55 124.552,1054 124,1054 L124,1054 Z M130,1037 L106,1037 C103.791,1037 102,1038.79 102,1041 L102,1065 C102,1067.21 103.791,1069 106,1069 L130,1069 C132.209,1069 134,1067.21 134,1065 L134,1041 C134,1038.79 132.209,1037 130,1037 L130,1037 Z"
          id="plus-square"
          sketch:type="MSShapeGroup"
        ></path>
      </g>
    </g>
    <g
      v-if="type === 'light'"
      xmlns="http://www.w3.org/2000/svg"
      id="Page-1"
      stroke="none"
      stroke-width="1"
      fill="navy"
      fill-rule="evenodd"
      xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
      sketch:type="MSPage"
    >
      <g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-100.000000, -1035.000000)" fill="navy">
        <path
          d="M130,1063 C130,1064.1 129.104,1065 128,1065 L104,1065 C102.896,1065 102,1064.1 102,1063 L102,1039 C102,1037.9 102.896,1037 104,1037 L128,1037 C129.104,1037 130,1037.9 130,1039 L130,1063 L130,1063 Z M128,1035 L104,1035 C101.791,1035 100,1036.79 100,1039 L100,1063 C100,1065.21 101.791,1067 104,1067 L128,1067 C130.209,1067 132,1065.21 132,1063 L132,1039 C132,1036.79 130.209,1035 128,1035 L128,1035 Z M122,1050 L117,1050 L117,1045 C117,1044.45 116.552,1044 116,1044 C115.448,1044 115,1044.45 115,1045 L115,1050 L110,1050 C109.448,1050 109,1050.45 109,1051 C109,1051.55 109.448,1052 110,1052 L115,1052 L115,1057 C115,1057.55 115.448,1058 116,1058 C116.552,1058 117,1057.55 117,1057 L117,1052 L122,1052 C122.552,1052 123,1051.55 123,1051 C123,1050.45 122.552,1050 122,1050 L122,1050 Z"
          id="plus-square"
          sketch:type="MSShapeGroup"
        ></path>
      </g>
    </g>
  </svg>
</template>
<script lang="ts">
export default {
  name: 'PlusInBoxIcon',
}
</script>
