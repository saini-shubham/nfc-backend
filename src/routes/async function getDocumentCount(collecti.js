async function getDocumentCount(collectionName) {
    const count = await collectionName.countDocuments();
    return count
  }
  
  getDocumentCount(Tag).then((count)=> {return count})
  