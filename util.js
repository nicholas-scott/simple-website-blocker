 const getSimpleUrl = (url) => {
    const webReg = /[((www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9]*)/
    return webReg.exec(url)[0]
}
