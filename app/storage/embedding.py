import chromadb
client = chromadb.PersistentClient(path="chroma.db")
collection = client.get_or_create_collection("agora")

def upsert(ids,metadatas,documents):

    """
    ids=["id1", "id2", "id3", ...],
    metadatas=[{"chapter": "3", "verse": "16"}, {"chapter": "3", "verse": "5"}, {"chapter": "29", "verse": "11"}, ...],
    documents=["doc1", "doc2", "doc3", ...],    
    """
    collection.add(
        ids=ids, # unique for each doc
        metadatas=metadatas, # filter on these!
        documents=documents, # we handle tokenization, embedding, and indexing automatically. You can skip that and add your own embeddings as well
    )