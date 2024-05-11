async function requestClient (clientName, number, direction, description) {
  const requestClient = {
    clientName: clientName,
    number: number,
    direction: direction,
    description: description ,
    }

    return requestClient
  }

  module.exports = requestClient