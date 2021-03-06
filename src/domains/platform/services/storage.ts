export type StorageKyes =
  | 'users'
  | 'posts'
  | 'current_user'
  | 'user_followers'
  | 'user_following'
  | 'user_post'
  | 'user_quote'
  | 'user_repost'

const validate = (key: StorageKyes) => {
  if (typeof key === 'undefined' && typeof window === 'undefined') {
    return false
  }

  return true
}

const getItem = <T>(key: StorageKyes) => {
  if (validate(key)) {
    try {
      const item = localStorage.getItem(key)

      if (item) {
        return JSON.parse(item) as T
      }

      return undefined
    } catch (error) {
      return undefined
    }
  }

  return undefined
}

const existItem = (key: StorageKyes) => {
  if (validate(key)) {
    try {
      const item = localStorage.getItem(key)

      return Boolean(item)
    } catch (error) {
      return false
    }
  }

  return false
}

const setItem = <T>(key: StorageKyes, value: T) => {
  if (validate(key)) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.log(error)
    }
  }
}

const setItemAtDocument = <T = Record<string, string[]>>(key: StorageKyes, nodeKey: string, value: T) => {
  if (validate(key)) {
    try {
      const document: { [key: string]: string[] } = getItem<T>(key) || {}

      const updatedNodeValue = {
        ...document,
        [nodeKey]: value
      }

      setItem(key, updatedNodeValue)
    } catch (error) {
      console.log(error)
    }
  }
}

const getValueFromNode = <T = Record<string, string[]>>(accesKey: StorageKyes, nodeKey: string, defaultValue = []) => {
  if (validate(accesKey)) {
    try {
      const document: { [key: string]: string[] } = getItem<T>(accesKey) || {}

      const nodeValue = document[nodeKey] || []
      return Boolean(nodeValue) ? nodeValue : defaultValue
    } catch (error) {
      console.log(error)
    }
  }
}

const setValueToItemAtDocument = <T>(key: StorageKyes, nodeKey: string, value: string) => {
  if (validate(key)) {
    try {
      const document: { [key: string]: string[] } = getItem<T>(key) || {}

      const previousData = getValueFromNode(key, nodeKey)
      const nextData = previousData?.filter(item => item !== value).concat(value)
      const updatedNodeValue = {
        ...document,
        [nodeKey]: nextData
      }

      setItem(key, updatedNodeValue)
    } catch (error) {
      console.log(error)
    }
  }
}

const removeValueItemAtDocument = <T = Record<string, string[]>>(key: StorageKyes, nodeKey: string, value: string) => {
  if (validate(key)) {
    try {
      const document: { [key: string]: string[] } = getItem<T>(key) || {}

      const previousData = getValueFromNode(key, nodeKey)
      const nextData = previousData?.filter(item => item !== value)
      const updatedNodeValue = {
        ...document,
        [nodeKey]: nextData
      }

      setItem(key, updatedNodeValue)
    } catch (error) {
      console.log(error)
    }
  }
}

const getValueToItemCollection = (key: StorageKyes, nodeKey: string) => {
  return getValueFromNode(key, nodeKey)
}

const getDocument = (key: StorageKyes, nodeKey: string) => {
  const data = getValueFromNode<string[]>(key, nodeKey) || []

  return { count: data?.length, data }
}

const storage = {
  getItem,
  setItem,
  existItem,
  getDocument,
  setItemAtDocument,
  getValueFromNode,
  setValueToItemAtDocument,
  getValueToItemCollection,
  removeValueItemAtDocument
}

export default storage
