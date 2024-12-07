import React, { useState } from "react";
import { addResource, getResourcesForIdea, deleteResource } from  "../../app/api/firebaseApi";

import { Resource } from "../../lib/types";

const ResourceManager = ({ ideaId }: { ideaId: string }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const fetchResources = async () => {
    try {
      const data = await getResourcesForIdea(ideaId);
      setResources(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching resources.");
    }
  };

  const handleAddResource = async () => {
    try {
      await addResource({ ideaId, title, url });
      fetchResources();
      setTitle("");
      setUrl("");
    } catch (err) {
      console.error(err);
      alert("Error adding resource.");
    }
  };

  const handleDeleteResource = async (id: string) => {
    try {
      await deleteResource(id);
      fetchResources();
    } catch (err) {
      console.error(err);
      alert("Error deleting resource.");
    }
  };

  return (
    <div>
      <h3>Resources</h3>
      <ul>
        {resources.map((res) => (
          <li key={res.id}>
            <a href={res.url} target="_blank" rel="noopener noreferrer">
              {res.title}
            </a>
            <button onClick={() => handleDeleteResource(res.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="url"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={handleAddResource}>Add Resource</button>
    </div>
  );
};

export default ResourceManager;
