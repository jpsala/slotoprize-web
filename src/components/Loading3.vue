<template>
  <div v-if="loadingText" class="spinner shadow">
    <span class="letters">Loading</span>
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>
</template>
<script>
import useGlobal from '../services/useGlobal'
const { loadingText } = useGlobal()

export default {
  setup () {
    return { loadingText }
  }
}
</script>
.<style lang="scss">
/*Huge thanks to @tobiasahlin at http://tobiasahlin.com/spinkit/ */
.spinner {
    display: inline-block;
    position: absolute;
    top: 17%;
    z-index: 1;
    left: calc(50% - 175px);
    background-color: #ffffffba;
    padding: 20px 71px;
    border-radius: 9px;
  .letters{
    font-size: 40px;
    margin-right: 10px;
  }
}

.spinner > div {
  margin-right: 10px;
  width: 6px;
  height: 6px;
  background-color: #333;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes sk-bouncedelay {
  0%, 80%, 100% { -webkit-transform: scale(0) }
  40% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bouncedelay {
  0%, 80%, 100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  } 40% {
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
  }
}

.shadow {
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}
</style>
