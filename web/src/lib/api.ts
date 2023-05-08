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
  return data.response
}
