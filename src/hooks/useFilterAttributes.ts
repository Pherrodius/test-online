export const filterAttributes = (object: { [key: string]: unknown }) => {
  const ett = Object.entries(object)
  return Object.fromEntries(ett.filter((e) => Boolean(e[1])))
}
