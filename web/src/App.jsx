import { useEffect, useState } from 'react'
import { useNuiEvent, post, isBrowser } from './nui'
import Panel from './Panel'
import { devOpen } from './dev'

export default function App() {
  const [data, setData] = useState(null)
  const [i18n, setI18n] = useState(null)
  const [tab, setTab] = useState('home')

  useNuiEvent((act, d) => {
    switch (act) {
      case 'open':
        setData(d.state)
        setI18n(d.i18n || null)
        if (d.devTab) setTab(d.devTab)
        break
      case 'state':
        setData(d.state)
        break
      case 'tick':
        setData((prev) => (prev ? { ...prev, time: { ...prev.time, hour: d.hour, minute: d.minute, second: d.second } } : prev))
        break
      case 'close':
        setData(null)
        break
      default:
        break
    }
  })

  useEffect(() => { if (isBrowser) devOpen() }, [])

  const close = () => { setData(null); post('close') }

  if (!data) return null
  return <Panel data={data} i18n={i18n} tab={tab} setTab={setTab} onClose={close} />
}
