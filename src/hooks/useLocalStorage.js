import { useEffect, useState } from 'react'

function read(key, initialValue) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? initialValue : JSON.parse(raw)
  } catch {
    // JSONが壊れている / localStorageが使えない場合は初期値で続行
    return initialValue
  }
}

/**
 * useState と同じ使い方で、値をlocalStorageへ自動保存するフック。
 * 戻り値: [value, setValue, clear]  (clear は state と保存データの両方を初期化)
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => read(key, initialValue))

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // 容量超過・プライベートモード等は無視(メモリ上では動作する)
    }
  }, [key, value])

  const clear = () => {
    try {
      window.localStorage.removeItem(key)
    } catch {
      // 無視
    }
    setValue(initialValue)
  }

  return [value, setValue, clear]
}
