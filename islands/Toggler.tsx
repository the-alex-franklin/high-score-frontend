import { useSignal } from "@preact/signals";
import axios from "axios";

export default function Toggler() {
  const showForm = useSignal(false);

  const sendNewScore = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const username = form.username.value;
    const score = form.score.value;

    await axios.post("https://high-score-api.deno.dev/new-high-score", {
      username,
      score,
    });

    window.location.reload();
  };

  if (showForm.value) {
    return (
      <div className="bg-white rounded-lg">
        <form onSubmit={sendNewScore}>
          <div className="flex flex-col gap-2 m-12">
            <input type="text" name="username" placeholder="username" className="border-2 border-black text-black" />
            <input type="number" name="score" placeholder="score" className="border-2 border-black text-black" />
            <div className="flex justify-end gap-2">
              <button onClick={() => showForm.value = false} className="bg-gray-500 w-min p-2 rounded">Cancel</button>
              <button type="submit" className="bg-blue-500 w-min p-2 rounded">Submit</button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <button
      className="bg-blue-500 rounded p-2"
      onClick={() => showForm.value = true}
    >
      Enter A New High Score
    </button>
  );
}
