const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const token = urlParams.get('activation')

export default token
