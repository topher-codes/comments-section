export const fetchResponse = async (input: string) => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      comment: input
    }),
  })
  const data = await response.json()
  if (data.response[0] === "Response") {
    //Remove the first element of the array, which is the word response.
    //This is a hacky way to get around the fact that the API returns the word response.
    data.response.shift()
  }
  return data.response
}
