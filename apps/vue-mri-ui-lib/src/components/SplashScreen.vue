<template>
  <div class="splash-container">
    <div class="loadingDialog">
      <div class="fiori2-loader">
        <div class="fiori2-blossom">
          <div class="fiori2-leafContainer fiori2-leafContainer1">
            <div class="fiori2-leaf fiori2-leaf1"></div>
          </div>
          <div class="fiori2-leafContainer fiori2-leafContainer2">
            <div class="fiori2-leaf fiori2-leaf2"></div>
          </div>
          <div class="fiori2-leafContainer fiori2-leafContainer3">
            <div class="fiori2-leaf fiori2-leaf3"></div>
          </div>
          <div class="fiori2-leafContainer fiori2-leafContainer4">
            <div class="fiori2-leaf fiori2-leaf4"></div>
          </div>
          <div class="fiori2-leafContainer fiori2-leafContainer5">
            <div class="fiori2-leaf fiori2-leaf5"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'splashScreen',
  data() {
    return {
      splashDisplay: false,
    }
  },
}
</script>

<style scoped lang="scss">
@import '../styles/_mri-variables.scss';
.splash-container {
  z-index: 8;
  visibility: visible;
  display: block;
  opacity: 0.9 !important;
  background: #ffffff;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  .loadingDialog {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -12px;
    margin-left: -150px;
    max-height: 535px;
    width: 18.75em;
    display: block;
    visibility: visible;
    z-index: 10;
  }
  .fiori2-loader {
    display: block;
    width: 25px;
    height: 25px;
    padding-right: 25px;
    margin: 0 auto;
    -moz-opacity: 0.5;
    -khtml-opacity: 0.5;
    -webkit-opacity: 0.5;
    opacity: 0.5;
    .fiori2-blossom {
      position: absolute;
      width: 30px;
      height: 30px;
      -webkit-animation-iteration-count: infinite;
      animation-iteration-count: infinite;
      -webkit-animation-name: rotateBlossom;
      animation-name: rotateBlossom;
      -webkit-animation-timing-function: linear;
      animation-timing-function: linear;
      -webkit-transform-origin: 100% 100%;
      transform-origin: 100% 100%;
      -webkit-animation-duration: 4s;
      animation-duration: 4s;
      .fiori2-leafContainer {
        position: absolute;
        width: inherit;
        height: inherit;
        -webkit-animation-iteration-count: infinite;
        animation-iteration-count: infinite;
        -webkit-animation-timing-function: linear;
        animation-timing-function: linear;
        -webkit-transform-origin: 100% 100%;
        transform-origin: 100% 100%;
        -webkit-animation-direction: alternate;
        animation-direction: alternate;
        .fiori2-leaf {
          background-color: #009de0;
          position: absolute;
          width: inherit;
          height: inherit;
          border: 1px solid #ffffff;
          border-top-left-radius: 100px;
          border-top-right-radius: 100px;
          border-bottom-left-radius: 100px;
          border-bottom-right-radius: 0;
          -webkit-animation-iteration-count: infinite;
          animation-iteration-count: infinite;
          -webkit-animation-timing-function: ease-in;
          animation-timing-function: ease-in;
          -webkit-transform-origin: 100% 100%;
          transform-origin: 100% 100%;
          -webkit-animation-direction: alternate;
          animation-direction: alternate;
        }
      }
      .fiori2-leafContainer1 {
        -webkit-animation-duration: 4s;
        animation-duration: 4s;
        -webkit-animation-name: fadeLeaf2-1;
        animation-name: fadeLeaf2-1;
        .fiori2-leaf1 {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
          -webkit-animation-duration: 0.75s;
          animation-duration: 0.75s;
          -webkit-animation-name: scaleLeaf2-1;
          animation-name: scaleLeaf2-1;
        }
      }
      .fiori2-leafContainer2 {
        -webkit-animation-duration: 10s;
        animation-duration: 10s;
        -webkit-animation-name: fadeLeaf2-2;
        animation-name: fadeLeaf2-2;
        .fiori2-leaf2 {
          -webkit-transform: rotate(72deg);
          transform: rotate(72deg);
          -webkit-animation-duration: 0.5s;
          animation-duration: 0.5s;
          -webkit-animation-name: scaleLeaf2-2;
          animation-name: scaleLeaf2-2;
        }
      }
      .fiori2-leafContainer3 {
        -webkit-animation-duration: 9s;
        animation-duration: 9s;
        -webkit-animation-name: fadeLeaf2-3;
        animation-name: fadeLeaf2-3;
        .fiori2-leaf3 {
          -webkit-transform: rotate(144deg);
          transform: rotate(144deg);
          -webkit-animation-duration: 0.6s;
          animation-duration: 0.6s;
          -webkit-animation-name: scaleLeaf2-3;
          animation-name: scaleLeaf2-3;
        }
      }
      .fiori2-leafContainer4 {
        -webkit-animation-duration: 6s;
        animation-duration: 6s;
        -webkit-animation-name: fadeLeaf2-4;
        animation-name: fadeLeaf2-4;
        .fiori2-leaf4 {
          -webkit-transform: rotate(216deg);
          transform: rotate(216deg);
          -webkit-animation-duration: 0.9s;
          animation-duration: 0.9s;
          -webkit-animation-name: scaleLeaf2-4;
          animation-name: scaleLeaf2-4;
        }
      }
      .fiori2-leafContainer5 {
        -webkit-animation-duration: 10s;
        animation-duration: 10s;
        -webkit-animation-name: fadeLeaf2-5;
        animation-name: fadeLeaf2-5;
        .fiori2-leaf5 {
          -webkit-transform: rotate(288deg);
          transform: rotate(288deg);
          -webkit-animation-duration: 1.3s;
          animation-duration: 1.3s;
          -webkit-animation-name: scaleLeaf2-5;
          animation-name: scaleLeaf2-5;
        }
      }
    }
  }
}
</style>
