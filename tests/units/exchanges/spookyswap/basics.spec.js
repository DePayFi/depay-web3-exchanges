import { find } from 'src'
import UniswapV2 from 'src/platforms/evm/uniswap_v2'

describe('spookyswap', () => {

  describe('basics', ()=> {
    
    it('provides basic structured data for spookyswap', ()=> {
      let exchange = find({ blockchain: 'fantom', name: 'spookyswap' })
      expect(exchange.name).toEqual('spookyswap')
      expect(exchange.blockchain).toEqual('fantom')
      expect(exchange.label).toEqual('SpookySwap')
      expect(exchange.logo).toEqual('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgNjQxIDY0MCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNjQxIDY0MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxwYXRoIGZpbGw9IiMxMjExMjIiIGQ9Ik0zNC4yLDMyMGMwLDE1OC41LDEyOC41LDI4Ni4zLDI4Ni4zLDI4Ni4zYzE1OC41LDAsMjg2LjMtMTI4LjUsMjg2LjMtMjg2LjNjMC0xNTguNS0xMjguNS0yODYuMy0yODYuMy0yODYuMwoJCUMxNjIuNywzMy43LDM0LjIsMTYyLjIsMzQuMiwzMjBMMzQuMiwzMjB6Ii8+Cgk8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI0YyRjRGOCIgZD0iTTEyMC45LDI0Ny42Yy0zLjMsMjIuMiwwLjcsNDUuNyw0LjYsNjcuOGMyLDMuMyw1LjIsNS45LDkuOCw3LjJjLTkuMSwxOS42LTE0LjMsNDAuNC0xNC4zLDYyLjYKCQljMCw5My4zLDkwLDE2OC45LDIwMS41LDE2OC45UzUyNCw0NzguNSw1MjQsMzg1LjJjMC0yMS41LTUuMi00My0xNC4zLTYyLjZjMy45LTEuMyw2LjUtMy45LDcuOC03LjJjNC42LTIyLjIsOC41LTQ1LjcsNS4yLTY3LjgKCQljLTMuMy0zMC0xMy43LTM5LjgtNDUtMzJjLTE1LjcsMy45LTM2LjUsMTMtNTIuOCwyNC4xYy0zMC0xNS02NS4yLTIzLjUtMTAyLjQtMjMuNWMtMzcuOCwwLTczLjcsOS4xLTEwMy43LDI0LjEKCQljLTE2LjMtMTEuMS0zNy4yLTIwLjktNTMuNS0yNC44QzEzNCwyMDcuOCwxMjQuMiwyMTcuNiwxMjAuOSwyNDcuNkwxMjAuOSwyNDcuNnogTTIzOC4zLDM4MC43Yy0yMy41LTEwLjQtNjMuOS03LjgtNjMuOS03LjgKCQlzMiwzNy44LDI0LjgsNTAuOWMyNy40LDE1LDc4LjksNy44LDc4LjksNy44UzI3My41LDM5Ni4zLDIzOC4zLDM4MC43TDIzOC4zLDM4MC43eiBNMzY5LjQsNDMyLjJjMCwwLDUwLjksNy44LDc4LjktNy44CgkJYzIzLjUtMTMsMjQuOC01MC45LDI0LjgtNTAuOXMtNDAuNC0yLjYtNjMuOSw3LjhDMzc0LDM5Ni4zLDM2OS40LDQzMS41LDM2OS40LDQzMi4yTDM2OS40LDQzMi4yeiBNMzEyLjcsNDU4LjkKCQljMCwyLjYsNS4yLDUuMiwxMS43LDUuMnMxMS43LTIsMTEuNy01LjJjMC0yLjYtNS4yLTUuMi0xMS43LTUuMkMzMTcuOSw0NTMuNywzMTIuNyw0NTUuNywzMTIuNyw0NTguOUwzMTIuNyw0NTguOXoiLz4KCTxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBmaWxsPSIjRjJGNEY4IiBkPSJNNTUyLjcsNDM1LjRjLTE4LjktNy4yLTM5LjEtMTEuMS01OS4zLTExLjFjLTUuMiwwLTUuMi03LjgsMC03LjhjMjAuOSwwLDQxLjcsMy45LDYxLjMsMTEuNwoJCWMyLDAuNywzLjMsMi42LDIuNiw0LjZDNTU2LjYsNDM0LjgsNTU0LjYsNDM2LjEsNTUyLjcsNDM1LjRMNTUyLjcsNDM1LjR6IE05Mi4yLDQyNy42YzE5LjYtNy44LDQwLjQtMTEuMSw2MS4zLTExLjcKCQljNS4yLDAsNS4yLDcuOCwwLDcuOGMtMjAuMiwwLTQwLjQsMy45LTU5LjMsMTEuMWMtMiwwLjctNC42LTAuNy01LjItMi42Qzg5LDQzMC45LDkwLjMsNDI4LjMsOTIuMiw0MjcuNkw5Mi4yLDQyNy42eiBNMTMyLjcsNDUwLjQKCQljOS44LTMuMywyMC4yLTQuNiwzMC01LjJjNS4yLDAsNS4yLDcuOCwwLDcuOGMtOS4xLDAtMTguOSwyLTI3LjQsNC42Yy04LjUsMi42LTE3LjYsNS45LTI0LjEsMTEuN2MtMy45LDMuMy05LjEtMi01LjktNS45CgkJQzExMy4xLDQ1NywxMjMuNSw0NTMuNywxMzIuNyw0NTAuNEwxMzIuNyw0NTAuNHogTTE3MS44LDQ2NS40Yy03LjgsMy4zLTE1LjcsNy44LTIyLjgsMTIuNGMtNy4yLDQuNi0xMy43LDEwLjQtMTguOSwxNwoJCWMtMS4zLDItMC43LDQuNiwxLjMsNS4yYzIsMS4zLDQuNiwwLjcsNS4yLTEuM2M0LjYtNS45LDExLjEtMTEuMSwxNy0xNWM3LjItNC42LDE0LjMtOC41LDIxLjUtMTEuN2MyLTEuMywyLjYtMy4zLDEuMy01LjIKCQlDMTc2LjQsNDY0LjgsMTczLjgsNDY0LjEsMTcxLjgsNDY1LjRMMTcxLjgsNDY1LjR6IE00ODMuNSw0NTMuN2M5LjEsMCwxOC45LDIsMjcuNCw0LjZjNC42LDEuMyw5LjEsMy4zLDEzLjcsNS4yCgkJYzMuOSwxLjMsNy4yLDMuOSwxMC40LDYuNWMzLjksMy4zLDkuMS0yLDUuOS01LjljLTcuMi02LjUtMTcuNi0xMC40LTI2LjctMTNjLTkuOC0zLjMtMjAuMi00LjYtMzAtNS4yCgkJQzQ3OSw0NDUuMiw0NzksNDUzLjcsNDgzLjUsNDUzLjdMNDgzLjUsNDUzLjd6IE00OTIuNyw0ODMuN2MtNy4yLTQuNi0xNC4zLTcuOC0yMS41LTExLjFsMCwwYy0yLTEuMy0yLjYtMy4zLTEuMy01LjIKCQljMS4zLTIsMy4zLTIuNiw1LjItMS4zYzE1LjcsNi41LDMyLDE1LjcsNDEuNywyOS4zYzEuMywyLDAuNyw0LjYtMS4zLDUuMmMtMiwxLjMtNC42LDAuNy01LjItMS4zCgkJQzUwNS43LDQ5Mi44LDQ5OS4yLDQ4Ny42LDQ5Mi43LDQ4My43TDQ5Mi43LDQ4My43eiIvPgoJPHBhdGggZmlsbD0iIzY2NjVERCIgZD0iTTYyLjIsMzM1LjdjMy45LTUuOSwzNS45LTIyLjgsNzUuNy0zMy4zYzguNS0yNC44LDE5LjYtNDguMywzMi03MS4xbDMyLTU4Yy05LjEtMy45LTE4LjMtOS4xLTI2LjctMTUKCQljLTEuMy0xLjMtMi42LTIuNi0zLjktMy45Yy0wLjctMS4zLTEuMy0zLjMtMS4zLTQuNnMyLTMuOSwyLjYtNC42YzItMi42LDQuNi00LjYsNy4yLTcuMmM1LjktNS4yLDEyLjQtOS44LDE5LjYtMTMuNwoJCWMzLjMtMiw2LjUtMy45LDkuOC02LjVjMjIuOC0xNC4zLDM1LjktMjUuNCw1Ni43LTM3LjhjMjAuMi0xMS43LDMwLTE4LjMsNTIuOC0xNy42YzI5LjMsMCwxMDEuNyw5Mi42LDEzNC4zLDE0MC4yCgkJYzE5LjYsMjguNyw0Ni4zLDgwLjIsNTYuMSw5OS44YzIsMC43LDQuNiwxLjMsNi41LDJjMzAsOS4xLDU4LjcsMjIuMiw2NS45LDMwLjdjNi41LDcuMi0yMS41LDEwLjQtNDguOSwxNS43CgkJYy0yNy40LDQuNi0xMjAuNyw3LjItMjEwLDcuOGMtODkuMywwLjctMTkzLjctMi42LTIxNi41LTUuOUM4My4xLDM0OS4zLDU3LjcsMzQyLjgsNjIuMiwzMzUuN0w2Mi4yLDMzNS43eiIvPgoJPHBhdGggZmlsbD0iI0ZGOTlBNSIgZD0iTTQ4My41LDI1Ni4xYzAsMC01OC43LTE1LTE2Mi40LTE1Yy0xMTEuNSwwLTE2NSwxNy0xNjUsMTdzLTYuNSwxMi40LTkuMSwxOC45Yy0yLjYsNy4yLTkuMSwyNS40LTkuMSwyNS40CgkJUzIxOC44LDI4OCwzMjIuNSwyODhjNjIuNiwwLDEyNC42LDUuMiwxODYuNSwxNS43YzAsMC05LjEtMjIuMi0xNS0zMS4zQzQ5MC43LDI2Ny4yLDQ4Ny41LDI2MS4zLDQ4My41LDI1Ni4xTDQ4My41LDI1Ni4xeiIvPgoJPHBhdGggZmlsbD0iI0ZGRTYwMCIgZD0iTTEzMy4zLDEzMS41YzYuNS0wLjcsMTUuNywxOS42LDE1LjcsMTkuNnMyMC45LTUuOSwyNC44LDBjMy4zLDUuOS0xNSwxOS42LTE1LDE5LjZzMTEuMSwxOS42LDcuMiwyMy41CgkJYy0zLjMsMy45LTIyLjgtOC41LTIyLjgtOC41cy0xNSwxNy0xOS42LDE0LjNjLTUuMi0yLjYsMC43LTI0LjgsMC43LTI0LjhzLTIxLjUtOS4xLTE5LjYtMTQuM2MxLjMtNS4yLDIzLjUtNy4yLDIzLjUtNy4yCgkJUzEyNi44LDEzMi44LDEzMy4zLDEzMS41TDEzMy4zLDEzMS41eiIvPgo8L2c+Cjwvc3ZnPgo=')
      expect(exchange.router.address).toEqual('0xF491e7B69E4244ad4002BC14e878a34207E38c29')
      expect(exchange.router.api).toEqual(UniswapV2.ROUTER)
      expect(exchange.factory.address).toEqual('0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3')
      expect(exchange.factory.api).toEqual(UniswapV2.FACTORY)
      expect(exchange.pair.api).toEqual(UniswapV2.PAIR)
    })
  })
})
