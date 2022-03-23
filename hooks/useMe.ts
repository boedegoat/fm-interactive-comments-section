import data from '../data.json'

const currentUser = { ...data.currentUser, name: data.currentUser.username }

const useMe = (commentUserId: number) => {
  return currentUser.id == commentUserId
}

export default useMe
