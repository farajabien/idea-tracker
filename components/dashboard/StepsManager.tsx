import React, { useState } from "react";
import { addStep, updateStep } from "../../app/api/firebaseApi"; 
import { Step } from "../../lib/types";
import { Textarea } from "../ui/textarea";

const StepsManager = ({ ideaId, steps }: { ideaId: string; steps: Step[] }) => {
  const [newStepName, setNewStepName] = useState("");
  const [newStepDescription, setNewStepDescription] = useState("");

  const handleAddStep = async () => {
    try {
      const newStep: Step = {
        id: String(Date.now()), // Temporary ID; Firebase can generate one
        name: newStepName,
        isCompleted: false,
        completedAt: null,
        description: ""
      };
      await addStep(ideaId, newStep);
      alert("Step added successfully!");
    } catch (err) {
      console.error(err);
      alert("Error adding step.");
    }
  };

  const toggleCompletion = async (step: Step) => {
    try {
      await updateStep(ideaId, { ...step, isCompleted: !step.isCompleted });
      alert("Step updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating step.");
    }
  };

  return (
    <div>
      <h3>Steps</h3>
      <ul>
        {steps.map((step) => (
          <li key={step.id}>
            <input
              type="checkbox"
              checked={step.isCompleted}
              onChange={() => toggleCompletion(step)}
            />
            {step.name}
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="New step name"
        value={newStepName}
        onChange={(e) => setNewStepName(e.target.value)}
      />
       <Textarea
        placeholder="What Does Success look like for this step"
        value={newStepDescription}
        onChange={(e) => setNewStepDescription(e.target.value)}
      />
      <button onClick={handleAddStep}>Add Step</button>
    </div>
  );
};

export default StepsManager;
