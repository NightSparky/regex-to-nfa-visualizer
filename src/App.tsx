import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NfaVisualizer from "./components/NfaVisualizer";
import { ReactFlowProvider } from "@xyflow/react";

export default function App() {
  const [regex, setRegex] = useState("");
  const [nfaData, setNfaData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    const cleanedRegex = regex.replace(/\s/g, ""); // to get rid of spaces. we dont want spaces in regex. why would we
    
    try {
      console.log("This has been clicked");
      const res = await fetch("http://127.0.0.1:8000/generate-nfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regex: cleanedRegex }),
      });

      if (!res.ok) {
        alert(
          `Your input is invalid, or the API is acting up. Status: ${res.status}`
        );
        throw new Error(`Whoops. something went wrong. status: ${res.status}`);
      }
      const data = await res.json();
      setNfaData(data);
    } catch (error) {
      alert(`Your input is invalid, or the API is acting up.`);
      console.log("Whoopsie daisy, ", error);
    }
  }

  return (
    <ReactFlowProvider>
      <div className="min-h-screen flex w-screen">
        <div className="flex flex-col items-center w-[20%] bg-gray-300 h-screen">
          <header className="w-full text-center mb-3 mt-9">
            <h1 className="text-2xl font-semibold mb-2 text-gray-800">
              A Simple Regex to NFA Visualizer
            </h1>
          </header>

          {/* INPUT AREA */}
          <section className="w-full max-w-2xl text-black p-6 flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Enter your regex (e.g. a(b|c)* )"
              value={regex}
              onChange={(e: any) => setRegex(e.target.value)}
              className="bg-gray-400"
            />
            <Button
              onClick={handleGenerate}
              disabled={loading || !regex}
              className="text-white bg-gray-600 cursor-pointer"
            >
              {loading ? "Generating..." : "Visualize NFA"}
            </Button>

            {/* FOOTER TO CREDIT THE GREAT STUDENTS WHO MADE THIS :) */}
            <footer className="w-full max-w-3xl text-center mb-8 items-center">
              <ul className="pl-6 text-xs mb-2 text-black opacity-50 text-center">
                <h1 className="text-xs mb-2 text-black text-center">
                  Presented and made by:
                </h1>
                <li>Ahmed Awadallah - 221000354</li>
                <li>Esraa Ahmed - 221000462</li>
                <li>Alhussein Nagdy - 221002149</li>
              </ul>
            </footer>
          </section>
        </div>

        {/* VISUAL OUTPUT */}
        <div className="flex-1 flex-col flex h-screen bg-white">
          <section className="w-full h-full">
            {nfaData ? (
              <div className="bg-gray-900 shadow-md h-full">
                <h2 className="text-xl font-semibold text-gray-700 absolute bg-gray-300 end-5 top-5 p-3 rounded-2xl shadow-inner">
                  NFA Visualization
                </h2>

                <div className="bg-white shadow-md h-full">
                  <NfaVisualizer nfa={nfaData} />
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center absolute bottom-1/2 start-1/2">
                Awaiting input. :)
              </p>
            )}
          </section>
        </div>
      </div>
    </ReactFlowProvider>
  );
}
