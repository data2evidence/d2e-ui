<template>
  <div class="axis-menu-button-wrapper" v-bind:style="componentStyle">
    <div class="iconWrapper">
      <label class="iconLabel">
        <span class="icon" v-bind:style="'font-family: app-icons'" v-html="getIcon"></span>
      </label>
    </div>
    <div class="buttonWrapper" ref="menuButtonWrapper">
      <button class="axisMenuButton" ref="menuButton" v-on:click="toggleMenu" v-bind:title="text" tabindex="0">
        <span class="axisMenuText">{{ text }}</span>
        <span class="axisMenuSubText">Select a filtercard</span>
        <span class="axisMenuButtonIcon"></span>
      </button>
      <dropDownMenu
        :target="menuButton"
        :subMenu="menuData"
        :opened="menuVisible"
        :openParam="menuOpenParam"
        @clickEv="handleClick"
        @closeEv="closeMenu"
      ></dropDownMenu>
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex'
import Constants from '../utils/Constants';
import DropDownMenu from './DropDownMenu.vue'

export default {
  name: 'cohortEntryExitButton',
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      menuData: [],
      menuVisible: false,
      menuButton: null,
      menuOpenParam: '',
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('click', this.closeSubMenu)
    })
    this.menuButton = this.$refs.menuButton
  },
  beforeDestroy() {
    window.removeEventListener('click', this.closeSubMenu)
  },
  computed: {
    ...mapGetters(['getChartableFilterCards', 'getText']),
    componentStyle() {
      const result: any = {
        position: 'absolute',
        top: this.text === Constants.CohortEntryExit.ENTRY ? 250 : 300,
      }
      return result
    },
    getIcon() {
      return this.text === Constants.CohortEntryExit.ENTRY ? Constants.CohortEntryExit.ENTRY_ICON : Constants.CohortEntryExit.EXIT_ICON
    },
  },
  methods: {
    ...mapActions(['setChartPropertyValue']),
    closeSubMenu(event) {
      if (this.menuVisible && !this.$refs.menuButtonWrapper.contains(event.target)) {
        this.closeMenu()
      }
    },
    handleClick(arg) {
      if (arg) {
        console.log('is clicked')
      }
      this.closeMenu()
    },
    toggleMenu(event) {
      const sourceEvent = event || window.event
      this.menuVisible = !this.menuVisible
      if (this.menuVisible) {
        if (sourceEvent.clientX || sourceEvent.clientY) {
          this.menuOpenParam = ''
        } else {
          this.$nextTick(() => {
            this.menuOpenParam = 'firstItem'
          })
        }
      } else {
        this.menuOpenParam = 'clear'
      }


      const filterCards = this.getChartableFilterCards.filter(
        card => card.name !== this.getText('MRI_PA_FILTERCARD_TITLE_BASIC_DATA')
      )
      
      this.menuData = filterCards.map((card, index) => ({
        idx: index,
        subMenuStyle: {},
        text: card.name,
        hasSubMenu: false,
        isSeperator: false,
        subMenu: [],
        disabled: false,
        data: { id: card.id, name: card.name },
      }))
    },
    closeMenu() {
      this.menuOpenParam = 'clear'
      this.menuVisible = false
    },
  },
  components: {
    DropDownMenu,
  },
}
</script>

