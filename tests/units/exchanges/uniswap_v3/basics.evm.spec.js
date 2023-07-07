import { find } from 'dist/esm/index.evm'
import UniswapV3 from 'src/platforms/evm/uniswap_v3'

describe('uniswap_v3', () => {

  describe('basics', ()=> {
    
    it('provides basic structured data for uniswap_v3', ()=> {
      let exchange = find({ name: 'uniswap_v3' })
      expect(exchange.name).toEqual('uniswap_v3')
      expect(exchange.blockchains).toEqual(['ethereum', 'bsc', 'polygon', 'optmism', 'arbitrum'])
      expect(exchange.label).toEqual('Uniswap v3')
      expect(exchange.logo).toEqual('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGRhdGEtdGVzdGlkPSJ1bmlzd2FwLWxvZ28iIGNsYXNzPSJyZ3c2ZXo0NHAgcmd3NmV6NGVqIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMjAuMzUyNiAxOS45MjQyQzIwLjI5MjggMjAuMTU0OSAyMC4xODg1IDIwLjM3MTUgMjAuMDQ1NSAyMC41NjE4QzE5Ljc3OTMgMjAuOTA4OCAxOS40MjcgMjEuMTc5NCAxOS4wMjM5IDIxLjM0NjZDMTguNjYxNCAyMS41MDM1IDE4LjI3NzQgMjEuNjA1IDE3Ljg4NDkgMjEuNjQ3NUMxNy44MDQyIDIxLjY1NzggMTcuNzIwNiAyMS42NjQxIDE3LjYzOTUgMjEuNjcwM0wxNy42MjYzIDIxLjY3MTNDMTcuMzc3NyAyMS42ODA4IDE3LjEzODcgMjEuNzcgMTYuOTQ0MiAyMS45MjU4QzE2Ljc0OTcgMjIuMDgxNyAxNi42MSAyMi4yOTYgMTYuNTQ1NSAyMi41MzczQzE2LjUxNiAyMi42NTc0IDE2LjQ5NCAyMi43NzkyIDE2LjQ3OTggMjIuOTAyMUMxNi40NTcyIDIzLjA4NzQgMTYuNDQ1NiAyMy4yNzcxIDE2LjQzMyAyMy40ODIzQzE2LjQyNCAyMy42Mjk1IDE2LjQxNDQgMjMuNzg0OCAxNi40IDIzLjk1MjFDMTYuMzE1NiAyNC42MzM3IDE2LjExOTMgMjUuMjk2NSAxNS44MTkyIDI1LjkxMzZDMTUuNzU3OSAyNi4wNDMzIDE1LjY5NTQgMjYuMTY5MSAxNS42MzM5IDI2LjI5MjZDMTUuMzA0OSAyNi45NTQ2IDE1LjAwNzYgMjcuNTUyNiAxNS4wOTI5IDI4LjM1MzVDMTUuMTU5NyAyOC45NzA2IDE1LjQ3NDQgMjkuMzg0MSAxNS44OTI1IDI5LjgxMDZDMTYuMDkxMSAzMC4wMTQ2IDE2LjM1NDQgMzAuMTg4OSAxNi42Mjc3IDMwLjM2OTlDMTcuMzkyNyAzMC44NzYzIDE4LjIzNjEgMzEuNDM0NyAxNy45NTgyIDMyLjg0MTVDMTcuNzMwOCAzMy45ODE0IDE1Ljg0OTQgMzUuMTc3NiAxMy4yMDUgMzUuNTk1NEMxMy40NjE1IDM1LjU1NjMgMTIuODk2NSAzNC41ODc5IDEyLjgzMzggMzQuNDgwNEwxMi44MyAzNC40NzM5QzEyLjc1NzEgMzQuMzU5MiAxMi42ODI0IDM0LjI0NjIgMTIuNjA3OSAzNC4xMzM0TDEyLjYwNzkgMzQuMTMzNEwxMi42MDc4IDM0LjEzMzRDMTIuMzkyNiAzMy44MDc2IDEyLjE3ODMgMzMuNDgzNSAxMi4wMTExIDMzLjEyNDFDMTEuNTY5MyAzMi4xODU2IDExLjM2NDUgMzEuMDk5OCAxMS41NDU1IDMwLjA3MTRDMTEuNzA5NSAyOS4xNDA3IDEyLjMyMjEgMjguMzk3MiAxMi45MTE4IDI3LjY4MTNMMTIuOTExOCAyNy42ODEzQzEzLjAwOCAyNy41NjQ2IDEzLjEwMzUgMjcuNDQ4NyAxMy4xOTY0IDI3LjMzMjhDMTMuOTg1MiAyNi4zNDg4IDE0LjgxMjggMjUuMDU5NSAxNC45OTU5IDIzLjc4MjJDMTUuMDExNCAyMy42NzEyIDE1LjAyNTIgMjMuNTUwMiAxNS4wMzk3IDIzLjQyMjlMMTUuMDM5NyAyMy40MjI5TDE1LjAzOTcgMjMuNDIyOUMxNS4wNjU3IDIzLjE5NSAxNS4wOTM5IDIyLjk0NjkgMTUuMTM4MiAyMi42OTk3QzE1LjIwMzkgMjIuMjcyOCAxNS4zMzcxIDIxLjg1OTEgMTUuNTMyNiAyMS40NzQzQzE1LjY2NiAyMS4yMjIgMTUuODQxNyAyMC45OTQ2IDE2LjA1MiAyMC44MDIxQzE2LjE2MTYgMjAuNjk5OSAxNi4yMzM5IDIwLjU2MzcgMTYuMjU3NCAyMC40MTUzQzE2LjI4MDggMjAuMjY3IDE2LjI1NCAyMC4xMTUgMTYuMTgxMyAxOS45ODM3TDExLjk2NTggMTIuMzY3M0wxOC4wMjA3IDE5Ljg3MzNDMTguMDg5NyAxOS45NjAzIDE4LjE3NjggMjAuMDMxIDE4LjI3NiAyMC4wODAzQzE4LjM3NTIgMjAuMTI5NiAxOC40ODQgMjAuMTU2NCAxOC41OTQ2IDIwLjE1ODhDMTguNzA1MyAyMC4xNjEyIDE4LjgxNTEgMjAuMTM5MSAxOC45MTYzIDIwLjA5NEMxOS4wMTc1IDIwLjA0OSAxOS4xMDc2IDE5Ljk4MjEgMTkuMTgwMiAxOS44OTgyQzE5LjI1NjkgMTkuODA4NCAxOS4zMDA0IDE5LjY5NDcgMTkuMzAzMyAxOS41NzYzQzE5LjMwNjMgMTkuNDU4IDE5LjI2ODUgMTkuMzQyMyAxOS4xOTYzIDE5LjI0ODdDMTguOTE0OCAxOC44ODczIDE4LjYyMTggMTguNTIxIDE4LjMzMDIgMTguMTU2M0wxOC4zMyAxOC4xNTZDMTguMjEyIDE4LjAwODUgMTguMDk0MyAxNy44NjEzIDE3Ljk3NzYgMTcuNzE0OEwxNi40NTM5IDE1LjgyMDVMMTMuMzk1NyAxMi4wMzgyTDEwIDhMMTMuNzg4IDExLjY5OTRMMTcuMDQzMyAxNS4zMTQ5TDE4LjY2NzMgMTcuMTI3QzE4LjgxNjUgMTcuMjk1OCAxOC45NjU3IDE3LjQ2MzEgMTkuMTE0OCAxNy42MzAzQzE5LjUwNDQgMTguMDY3MSAxOS44OTQgMTguNTAzOSAyMC4yODM2IDE4Ljk2NzNMMjAuMzcyIDE5LjA3NTVMMjAuMzkxNCAxOS4yNDMzQzIwLjQxNzYgMTkuNDcwOCAyMC40MDQ1IDE5LjcwMTIgMjAuMzUyNiAxOS45MjQyWk0zNS45MjQ3IDIyLjQ2OTdMMzUuOTMxMSAyMi40Nzk1QzM1LjkzIDIxLjY3MTkgMzUuNDMyMiAyMC4zMzk0IDM0LjQyNDcgMTkuMDU3N0wzNC40MDEgMTkuMDI2M0MzNC4wOTA2IDE4LjY0MSAzMy43NTI0IDE4LjI3OTIgMzMuMzg5MSAxNy45NDM4QzMzLjMyMTIgMTcuODc3OCAzMy4yNDggMTcuODEyOCAzMy4xNzM2IDE3Ljc0NzlDMzIuNzA4MSAxNy4zNDAxIDMyLjE5OTMgMTYuOTg1IDMxLjY1NjQgMTYuNjg5MkwzMS42MTc2IDE2LjY2OTdDMjkuOTExOCAxNS43MzY2IDI3LjY5MiAxNS4yNTYgMjQuOTU0OSAxNS43OTcyQzI0LjU4NzMgMTUuMzQ4OSAyNC4xOTE0IDE0LjkyNDggMjMuNzY5NiAxNC41Mjc1QzIzLjEyMzYgMTMuOTA5MSAyMi4zNjMyIDEzLjQyNDEgMjEuNTMxNSAxMy4wOTk3QzIwLjcwNzIgMTIuNzk2NiAxOS44MjQ0IDEyLjY4ODQgMTguOTUxNyAxMi43ODM2QzE5Ljc5MjkgMTIuODU5NyAyMC42MTIzIDEzLjA5NDcgMjEuMzY2NiAxMy40NzY0QzIyLjA5NTEgMTMuODY4NSAyMi43NTEyIDE0LjM4MzMgMjMuMzA2MiAxNC45OTg0QzIzLjg2ODggMTUuNjI2MyAyNC4zOTc2IDE2LjI4MzkgMjQuODkwMyAxNi45Njg1TDI1LjAxMzkgMTcuMTMwMkMyNS40OTYgMTcuNzYwOSAyNS45ODY4IDE4LjQwMyAyNi41OTgyIDE4Ljk3NDRDMjYuOTM0OCAxOS4yOTI1IDI3LjMxMDMgMTkuNTY2NCAyNy43MTU3IDE5Ljc4OTVDMjcuODIzNCAxOS44NDQ3IDI3LjkzMjMgMTkuODk2NiAyOC4wMzkgMTkuOTQyMUMyOC4xNDU2IDE5Ljk4NzYgMjguMjQ1OCAyMC4wMjk4IDI4LjM1MzYgMjAuMDY4OEMyOC41NjE2IDIwLjE0OTkgMjguNzc3MSAyMC4yMTcxIDI4Ljk5MjYgMjAuMjc4OEMyOS44NTQ3IDIwLjUyNTYgMzAuNzM3MiAyMC42MTQzIDMxLjU5OTMgMjAuNjYyQzMxLjcxOTIgMjAuNjY4MyAzMS44Mzg5IDIwLjY3NDIgMzEuOTU4MSAyMC42ODAxTDMxLjk1ODMgMjAuNjgwMUMzMi4yNjYyIDIwLjY5NTQgMzIuNTcxMyAyMC43MTA1IDMyLjg3MTkgMjAuNzMyM0MzMy4yODM3IDIwLjc1NjkgMzMuNjkyMiAyMC44MjE0IDM0LjA5MTcgMjAuOTI1QzM0LjY5MTggMjEuMDgyMiAzNS4yMjAxIDIxLjQ0MTMgMzUuNTg4NSAyMS45NDI1QzM1LjcxMzcgMjIuMTA5NSAzNS44MjYxIDIyLjI4NTcgMzUuOTI0NyAyMi40Njk3Wk0zMy40MDEzIDE3Ljk0NTFDMzMuMzU4IDE3LjkwNDkgMzMuMzEzOSAxNy44NjUxIDMzLjI3IDE3LjgyNTRMMzMuMjcgMTcuODI1NEMzMy4yNDE4IDE3Ljc5OTkgMzMuMjEzNiAxNy43NzQ1IDMzLjE4NTggMTcuNzQ5MUMzMy4yMDczIDE3Ljc2ODggMzMuMjI4OCAxNy43ODg3IDMzLjI1MDMgMTcuODA4N0MzMy4zMDA5IDE3Ljg1NTYgMzMuMzUxNCAxNy45MDI1IDMzLjQwMTMgMTcuOTQ1MVpNMzIuMzIzOCAyNS45MTcyQzI5LjU1MTYgMjQuNzg3MiAyNi42NTE4IDIzLjYwNTEgMjcuMDgzNSAyMC4yODc1QzI4LjAwOTEgMjEuMjgwMiAyOS40NjIgMjEuNDg4NCAzMS4wNDIyIDIxLjcxNDlDMzIuNDc1NyAyMS45MjAzIDM0LjAxMzkgMjIuMTQwNyAzNS4zNTgzIDIyLjk3NTNDMzguNTMwNiAyNC45NDMzIDM4LjA2NzMgMjguNzY2NiAzNi45ODk3IDMwLjE3MzlDMzcuMDg2OSAyNy44NTg3IDM0Ljc1NDQgMjYuOTA4IDMyLjMyMzggMjUuOTE3MlpNMjEuMTU1MSAyNC4yNTY3QzIxLjg4NjggMjQuMTg2MyAyMy40NDYxIDIzLjgwNDIgMjIuNzQ4OSAyMi41NzEyQzIyLjU5ODkgMjIuMzIwNCAyMi4zODE1IDIyLjExNzIgMjIuMTIxNyAyMS45ODQ4QzIxLjg2MTkgMjEuODUyNSAyMS41NzAyIDIxLjc5NjUgMjEuMjgwMSAyMS44MjMyQzIwLjk4NTggMjEuODU1IDIwLjcwODIgMjEuOTc2OSAyMC40ODUyIDIyLjE3MjVDMjAuMjYyMiAyMi4zNjgxIDIwLjEwNDQgMjIuNjI3OCAyMC4wMzM0IDIyLjkxNjVDMTkuODE2OCAyMy43MjMgMjAuMDQ2MyAyNC4zNjQ5IDIxLjE1NTEgMjQuMjU2N1pNMjAuOTQ0OCAxNC41MDE0QzIwLjQ4NTggMTMuOTY4OCAxOS43NzM1IDEzLjY4OTUgMTkuMDc1MiAxMy41ODc4QzE5LjA0OTEgMTMuNzYyNSAxOS4wMzI2IDEzLjkzODUgMTkuMDI1NyAxNC4xMTVDMTguOTk0NCAxNS41Njg3IDE5LjUwODQgMTcuMTY1NCAyMC41MDMgMTguMjc1QzIwLjgyMTIgMTguNjMzNyAyMS4yMDQ5IDE4LjkyNzYgMjEuNjMzNCAxOS4xNDFDMjEuODgxMiAxOS4yNjIyIDIyLjUzODYgMTkuNTYzMSAyMi43ODIxIDE5LjI5MjVDMjIuODAwNiAxOS4yNjc3IDIyLjgxMjMgMTkuMjM4NCAyMi44MTU5IDE5LjIwNzZDMjIuODE5NSAxOS4xNzY4IDIyLjgxNDkgMTkuMTQ1NiAyMi44MDI2IDE5LjExNzJDMjIuNzYyMiAxOS4wMDEzIDIyLjY4NDMgMTguODk2MSAyMi42MDY5IDE4Ljc5MTdDMjIuNTUyIDE4LjcxNzcgMjIuNDk3NCAxOC42NDQxIDIyLjQ1NjcgMTguNTY3MkMyMi40MTU1IDE4LjQ4OTggMjIuMzcxNCAxOC40MTQyIDIyLjMyNzQgMTguMzM4OEwyMi4zMjc0IDE4LjMzODhDMjIuMjQ0NyAxOC4xOTcgMjIuMTYyMiAxOC4wNTU1IDIyLjA5ODkgMTcuOTAxNUMyMS45MzE5IDE3LjQ5ODQgMjEuODQ1IDE3LjA2OTggMjEuNzU4MyAxNi42NDI1TDIxLjc1ODMgMTYuNjQyNEwyMS43NTgzIDE2LjY0MjRMMjEuNzU4MyAxNi42NDIzTDIxLjc1ODIgMTYuNjQyMkwyMS43NTgyIDE2LjY0MjFMMjEuNzU4MiAxNi42NDJDMjEuNzQwOSAxNi41NTY2IDIxLjcyMzYgMTYuNDcxMiAyMS43MDU2IDE2LjM4NkMyMS41NzMxIDE1LjcyNjggMjEuNDAzOSAxNS4wMzQgMjAuOTQ0OCAxNC41MDE0Wk0zMC43NTI0IDI2LjA5OEMzMC4wNDAzIDI4LjA5NDMgMzEuMTg4OCAyOS43ODA0IDMyLjMzMDYgMzEuNDU2NkMzMy42MDc3IDMzLjMzMTUgMzQuODc2NCAzNS4xOTQgMzMuNTIyOCAzNy40NjQyQzM2LjE1MzIgMzYuMzczMSAzNy40MDIxIDMzLjA3NjkgMzYuMzEwNSAzMC40NjE2QzM1LjYyMjcgMjguODA3NCAzMy45NjQ5IDI3LjkxMDYgMzIuNDI2MSAyNy4wNzgzTDMyLjQyNjEgMjcuMDc4M0wzMi40MjYgMjcuMDc4MkMzMS44MjkgMjYuNzU1MyAzMS4yNDk5IDI2LjQ0MjEgMzAuNzUyNCAyNi4wOThaTTIzLjA1NTIgMzAuODYzM0MyMi41Nzg1IDMxLjA1ODcgMjIuMTI5IDMxLjMxNTIgMjEuNzE3OSAzMS42MjY1QzIyLjY1MjcgMzEuMjg1OSAyMy42MzM5IDMxLjA5MTQgMjQuNjI3NCAzMS4wNDk1QzI0LjgwNzQgMzEuMDM4OCAyNC45ODg3IDMxLjAzMDQgMjUuMTcxNSAzMS4wMjE5TDI1LjE3MTcgMzEuMDIxOUwyNS4xNzIgMzEuMDIxOUMyNS40ODc4IDMxLjAwNzMgMjUuODA4NSAzMC45OTI1IDI2LjEzNiAzMC45NjUxQzI2LjY3MjkgMzAuOTI4NSAyNy4yMDI1IDMwLjgxOTIgMjcuNzEwMyAzMC42NDAzQzI4LjI0MjUgMzAuNDUzMyAyOC43MjY4IDMwLjE1MDEgMjkuMTI4NCAyOS43NTI3QzI5LjUzNDIgMjkuMzQyNCAyOS44MTg4IDI4LjgyNzIgMjkuOTUwNiAyOC4yNjQyQzMwLjA2NjYgMjcuNzMyNCAzMC4wNTAzIDI3LjE4MDEgMjkuOTAzMiAyNi42NTYyQzI5Ljc1NiAyNi4xMzIyIDI5LjQ4MjUgMjUuNjUyOCAyOS4xMDY5IDI1LjI2MDNDMjkuMjg4MSAyNS43MjIxIDI5LjM5OTYgMjYuMjA4NCAyOS40Mzc3IDI2LjcwMzNDMjkuNDcwNSAyNy4xNjQgMjkuNDA4MSAyNy42MjY1IDI5LjI1NDUgMjguMDYxOEMyOS4xMDQ1IDI4LjQ3NDQgMjguODU5MyAyOC44NDU0IDI4LjUzOSAyOS4xNDQzQzI4LjIwODEgMjkuNDQ2MiAyNy44MjUgMjkuNjg0NiAyNy40MDg2IDI5Ljg0NzlDMjYuODI5OSAzMC4wODIxIDI2LjE3NTUgMzAuMTc3OSAyNS40OTM5IDMwLjI3NzdDMjUuMTgzIDMwLjMyMzIgMjQuODY2NCAzMC4zNjk2IDI0LjU0ODcgMzAuNDMwM0MyNC4wMzc4IDMwLjUyNDMgMjMuNTM3NCAzMC42Njk0IDIzLjA1NTIgMzAuODYzM1pNMzEuMzE4NyAzOS4xMDQ2TDMxLjI3MyAzOS4xNDE1TDMxLjI3MyAzOS4xNDE2QzMxLjE1MjUgMzkuMjM4OSAzMS4wMzAxIDM5LjMzNzkgMzAuODk4MiAzOS40MjY4QzMwLjczMDEgMzkuNTM4IDMwLjU1NCAzOS42MzY1IDMwLjM3MTMgMzkuNzIxMkMyOS45OTA4IDM5LjkwNzcgMjkuNTcyNiA0MC4wMDI5IDI5LjE0OTMgMzkuOTk5NEMyOC4wMDI4IDM5Ljk3NzggMjcuMTkyNCAzOS4xMjA1IDI2LjcxODMgMzguMTUxNkMyNi41OTQgMzcuODk3NyAyNi40ODQ1IDM3LjYzNTkgMjYuMzc1IDM3LjM3NDFMMjYuMzc1IDM3LjM3NDFDMjYuMTk5NyAzNi45NTUxIDI2LjAyNDQgMzYuNTM2MSAyNS43ODgzIDM2LjE0OUMyNS4yMzk5IDM1LjI0OTUgMjQuMzAxMyAzNC41MjUzIDIzLjIwMjIgMzQuNjU5NUMyMi43NTM5IDM0LjcxNTggMjIuMzMzNiAzNC45MTgyIDIyLjA4NDcgMzUuMzA5QzIxLjQyOTUgMzYuMzI5OCAyMi4zNzAzIDM3Ljc1OTggMjMuNTY5NiAzNy41NTczQzIzLjY3MTYgMzcuNTQxNyAyMy43NzE0IDM3LjUxNDEgMjMuODY3IDM3LjQ3NTFDMjMuOTYyMyAzNy40MzQzIDI0LjA1MTIgMzcuMzggMjQuMTMxIDM3LjMxMzhDMjQuMjk4NiAzNy4xNzM2IDI0LjQyNDggMzYuOTkwMyAyNC40OTYzIDM2Ljc4MzRDMjQuNTc1MSAzNi41Njc2IDI0LjU5MjYgMzYuMzM0MSAyNC41NDcgMzYuMTA5QzI0LjQ5NzggMzUuODczNiAyNC4zNTk0IDM1LjY2NjggMjQuMTYxMiAzNS41MzJDMjQuMzkxNyAzNS42NDA0IDI0LjU3MTMgMzUuODM0NSAyNC42NjIzIDM2LjA3MzJDMjQuNzU2NiAzNi4zMTkgMjQuNzgwOSAzNi41ODYyIDI0LjczMjMgMzYuODQ1MUMyNC42ODUyIDM3LjExNDcgMjQuNTY2OSAzNy4zNjY3IDI0LjM4OTYgMzcuNTc0N0MyNC4yOTU1IDM3LjY4MTYgMjQuMTg2NiAzNy43NzQ2IDI0LjA2NjQgMzcuODUwN0MyMy45NDcyIDM3LjkyNTkgMjMuODE5NSAzNy45ODY2IDIzLjY4NiAzOC4wMzE1QzIzLjQxNTMgMzguMTI0NCAyMy4xMjcyIDM4LjE1NDQgMjIuODQzMyAzOC4xMTkyQzIyLjQ0NDcgMzguMDYyMSAyMi4wNjg4IDM3Ljg5ODMgMjEuNzU1IDM3LjY0NUMyMS42OTcgMzcuNTk5IDIxLjY0MTQgMzcuNTUwOCAyMS41ODc1IDM3LjUwMDhDMjEuMzc0IDM3LjMxNTggMjEuMTgwMiAzNy4xMDg3IDIxLjAwOTMgMzYuODgyOUMyMC45MzI2IDM2Ljc5ODEgMjAuODU0NyAzNi43MTQ0IDIwLjc3MzMgMzYuNjM0QzIwLjM4OTEgMzYuMjI5IDE5LjkzNTggMzUuODk2NSAxOS40MzQ5IDM1LjY1MjJDMTkuMDg5NSAzNS40OTk4IDE4LjcyOCAzNS4zODcyIDE4LjM1NzQgMzUuMzE2NkMxOC4xNzA5IDM1LjI3NzYgMTcuOTgyNCAzNS4yNDk1IDE3Ljc5MzggMzUuMjI1N0MxNy43NzMzIDM1LjIyMzYgMTcuNzM0IDM1LjIxNjcgMTcuNjg1IDM1LjIwODJMMTcuNjg0NyAzNS4yMDgxTDE3LjY4NDYgMzUuMjA4MUwxNy42ODQ2IDM1LjIwODFMMTcuNjg0NiAzNS4yMDgxTDE3LjY4NDUgMzUuMjA4MUMxNy41MjcxIDM1LjE4MDYgMTcuMjcxMSAzNS4xMzYgMTcuMjI1OSAzNS4xNzhDMTcuODA4OCAzNC42MzkgMTguNDQ0MSAzNC4xNjAzIDE5LjEyMjQgMzMuNzQ5MUMxOS44MTg5IDMzLjMzNCAyMC41NjY3IDMzLjAxMjYgMjEuMzQ2NiAzMi43OTMzQzIyLjE1NTEgMzIuNTY0NyAyMy4wMDA5IDMyLjQ5OTUgMjMuODM0NyAzMi42MDE3QzI0LjI2MzkgMzIuNjUzNSAyNC42ODQzIDMyLjc2MjcgMjUuMDg0NyAzMi45MjY0QzI1LjUwNDIgMzMuMDk0OCAyNS44OTE0IDMzLjMzNTEgMjYuMjI5MSAzMy42MzY2QzI2LjU2MzIgMzMuOTUyOCAyNi44MzMzIDM0LjMzMTEgMjcuMDI0MyAzNC43NTA0QzI3LjE5NjggMzUuMTQzMSAyNy4zMjU0IDM1LjU1MzcgMjcuNDA3OSAzNS45NzQ3QzI3LjQ1MjEgMzYuMjAxMyAyNy40ODU1IDM2LjQ1MDIgMjcuNTE5OSAzNi43MDc5TDI3LjUyIDM2LjcwNzlMMjcuNTIgMzYuNzA4TDI3LjUyIDM2LjcwOEMyNy42NzcxIDM3Ljg4MjMgMjcuODU4NSAzOS4yMzcyIDI5LjIwNDMgMzkuNDczM0MyOS4yODk4IDM5LjQ5IDI5LjM3NjEgMzkuNTAyMyAyOS40NjI5IDM5LjUxMDJMMjkuNzMxMiAzOS41MTY2QzI5LjkxNTcgMzkuNTAzNCAzMC4wOTkgMzkuNDc3IDMwLjI3OTcgMzkuNDM3NkMzMC42NTQxIDM5LjM0OTIgMzEuMDE5IDM5LjIyNDEgMzEuMzY5MSAzOS4wNjQyTDMxLjMxODcgMzkuMTA0NlpNMjEuMDgwMSAzNi45NjE5QzIxLjExMjMgMzYuOTk4OSAyMS4xNDQ5IDM3LjAzNTUgMjEuMTc3OSAzNy4wNzE4QzIxLjE2NDQgMzcuMDU2NyAyMS4xNTEgMzcuMDQxNSAyMS4xMzc1IDM3LjAyNjRMMjEuMTM3NSAzNy4wMjY0TDIxLjEzNzUgMzcuMDI2NEwyMS4xMzc1IDM3LjAyNjRDMjEuMTE4NCAzNy4wMDQ5IDIxLjA5OTMgMzYuOTgzNCAyMS4wODAxIDM2Ljk2MTlaIiBmaWxsPSJjdXJyZW50Q29sb3IiPjwvcGF0aD48L3N2Zz4K')
      expect(exchange.slippage).toEqual(true)

      expect(exchange.ethereum.router.address).toEqual('0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad')
      expect(exchange.ethereum.router.api).toEqual(UniswapV3.ROUTER)
      expect(exchange.ethereum.factory.address).toEqual('0x1F98431c8aD98523631AE4a59f267346ea31F984')
      expect(exchange.ethereum.factory.api).toEqual(UniswapV3.FACTORY)
      expect(exchange.ethereum.pool.api).toEqual(UniswapV3.POOL)
      expect(exchange.ethereum.quoter.address).toEqual('0x61fFE014bA17989E743c5F6cB21bF9697530B21e')
      expect(exchange.ethereum.quoter.api).toEqual(UniswapV3.QUOTER)

      expect(exchange.bsc.router.address).toEqual('0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad')
      expect(exchange.bsc.router.api).toEqual(UniswapV3.ROUTER)
      expect(exchange.bsc.factory.address).toEqual('0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7')
      expect(exchange.bsc.factory.api).toEqual(UniswapV3.FACTORY)
      expect(exchange.bsc.pool.api).toEqual(UniswapV3.POOL)
      expect(exchange.bsc.quoter.address).toEqual('0x78D78E420Da98ad378D7799bE8f4AF69033EB077')
      expect(exchange.bsc.quoter.api).toEqual(UniswapV3.QUOTER)

      expect(exchange.polygon.router.address).toEqual('0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad')
      expect(exchange.polygon.router.api).toEqual(UniswapV3.ROUTER)
      expect(exchange.polygon.factory.address).toEqual('0x1F98431c8aD98523631AE4a59f267346ea31F984')
      expect(exchange.polygon.factory.api).toEqual(UniswapV3.FACTORY)
      expect(exchange.polygon.pool.api).toEqual(UniswapV3.POOL)
      expect(exchange.polygon.quoter.address).toEqual('0x61fFE014bA17989E743c5F6cB21bF9697530B21e')
      expect(exchange.polygon.quoter.api).toEqual(UniswapV3.QUOTER)

      expect(exchange.optmism.router.address).toEqual('0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad')
      expect(exchange.optmism.router.api).toEqual(UniswapV3.ROUTER)
      expect(exchange.optmism.factory.address).toEqual('0x1F98431c8aD98523631AE4a59f267346ea31F984')
      expect(exchange.optmism.factory.api).toEqual(UniswapV3.FACTORY)
      expect(exchange.optmism.pool.api).toEqual(UniswapV3.POOL)
      expect(exchange.optmism.quoter.address).toEqual('0x61fFE014bA17989E743c5F6cB21bF9697530B21e')
      expect(exchange.optmism.quoter.api).toEqual(UniswapV3.QUOTER)

      expect(exchange.arbitrum.router.address).toEqual('0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad')
      expect(exchange.arbitrum.router.api).toEqual(UniswapV3.ROUTER)
      expect(exchange.arbitrum.factory.address).toEqual('0x1F98431c8aD98523631AE4a59f267346ea31F984')
      expect(exchange.arbitrum.factory.api).toEqual(UniswapV3.FACTORY)
      expect(exchange.arbitrum.pool.api).toEqual(UniswapV3.POOL)
      expect(exchange.arbitrum.quoter.address).toEqual('0x61fFE014bA17989E743c5F6cB21bF9697530B21e')
      expect(exchange.arbitrum.quoter.api).toEqual(UniswapV3.QUOTER)

    })
  })
})
