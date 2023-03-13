import React, { useState } from "react";
import dynamic from 'next/dynamic';
const SyntaxHighlighter = dynamic(() => import('react-syntax-highlighter'));
import { vs } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import Head from "next/head";
import Github from "../components/GitHub";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Analytics } from "@vercel/analytics/react";
import Footer from "../components/Footer";
import ThemeButton from '../components/ThemeButton';
import { faCopy, faTrashAlt } from "@fortawesome/free-solid-svg-icons";


export default function Home() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHumanToSql, setIsHumanToSql] = useState(true);
  const [isOutputTextUpperCase, setIsOutputTextUpperCase] = useState(false);
  const [isCopied, setIsCopied] = useState(false);


  const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setInputText(event.target.value);

  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };
  

  const handleClear = () => {
    setInputText("");
    setOutputText("");
  };


  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`/api/${isHumanToSql ? "translate" : "sql-to-human"}`, {
        method: "POST",
        body: JSON.stringify({ inputText }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("data:", data); // Add this line
        setOutputText(data.outputText);
      } else {
        setOutputText(`Error translating ${isHumanToSql ? "to SQL" : "to human"}.`);
      }
    } catch (error) {
      console.log(error);
      setOutputText(`Error translating ${isHumanToSql ? "to SQL" : "to human"}.`);
    }
    setIsLoading(false);
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Head>
        <title>{isHumanToSql ? "Human to SQL Translator" : "SQL to Human Translator"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-lg mx-auto my-12 px-4">
        <ThemeButton className='absolute top-2.5 right-2.5 text-gray-500 dark:text-gray-400 focus:outline-none hover:scale-125 transition' />
        <div className="flex items-center justify-center">
          <a
            className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-blue-600 text-white px-5 py-2 text-sm shadow-md hover:bg-blue-500 bg-blue-600 font-medium transition"
            href="https://github.com/whoiskatrin/sql-translator"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github />
            <p>Star on GitHub</p>
          </a>
        </div>

        <h1 className="text-3xl font-bold text-center mt-4 mb-8">
          {isHumanToSql ? "Human to SQL Translator" : "SQL to Human Translator"}
        </h1>

        <form onSubmit={(event) => handleSubmit(event)} className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="flex flex-col mb-4">
            <label htmlFor="inputText" className="block font-bold mb-2">
              {isHumanToSql ? "Human Language Query" : "SQL Query"}
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-100 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="inputText"
              rows={3}
              placeholder={isHumanToSql ? "e.g. show me all the cars that are red" : "SELECT * FROM cars WHERE color = 'red'"}
              value={inputText}
              onChange={handleInputChange}
              required
              autoFocus
            />
          </div>
          <div className="flex justify-between">
            <div className="flex items-center">

              <FontAwesomeIcon
                onClick={handleClear}
                icon={faTrashAlt}
                className="text-gray-700 dark:text-gray-200 font-bold ml-2 text-xs icon-size-30 switch-icon w-4 h-4" />

              <FontAwesomeIcon
                icon={faExchangeAlt}
                className={`text-gray-700 dark:text-gray-200 font-bold ml-2 cursor-pointer transition-transform duration-300 ${isHumanToSql ? "transform rotate-90" : ""
                  } icon-size-30 switch-icon w-4 h-4`}
                onClick={() => setIsHumanToSql(!isHumanToSql)}
              />
            </div>
          </div>





          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isLoading && "opacity-50 cursor-not-allowed"
              }`}
            disabled={isLoading}
          >
            {isLoading ? "Translating..." : `Translate to ${isHumanToSql ? "SQL" : "Natural Language"}`}
          </button>
        </form>


        {outputText && (
          <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <label htmlFor="outputText" className="block font-bold mb-2">
              {isHumanToSql ? "SQL Query" : "Human Language Query"}
            </label>
            <div className="flex justify-between mb-4">
              {isHumanToSql && (
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => setIsOutputTextUpperCase(!isOutputTextUpperCase)}
                >
                  {isOutputTextUpperCase ? "lowercase" : "UPPERCASE"}
                </button>
              )}
            </div>
            <SyntaxHighlighter
              language='sql'
              style={vs}
              wrapLines={true}
              showLineNumbers={true}
              lineNumberStyle={{ color: '#ccc' }}
              customStyle={{ maxHeight: 'none', height: 'auto', overflow: 'visible', wordWrap: 'break-word' }}
              lineProps={{ style: { whiteSpace: 'pre-wrap' } }}
            >
              {isOutputTextUpperCase ? outputText.toUpperCase() : outputText.toLowerCase()}
            </SyntaxHighlighter>
            <FontAwesomeIcon onClick={handleCopy} icon={faCopy} className="text-gray-700 dark:text-gray-200 font-bold ml-2 text-xs icon-size-30 switch-icon w-4 h-4 mr-2" />
            {isCopied && <p className="text-blue-500 text-sm">Copied to clipboard!</p>}
            <textarea
              className="hidden"
              id="outputText"
              value={isOutputTextUpperCase ? outputText.toUpperCase() : outputText.toLowerCase()}
              readOnly
            />
          </div>
        )}
      </main>
      <Analytics />
      <Footer />
    </div >
  );
}
