import React from "react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

type ResultT = {
  name: string;
  age: Number;
  count: Number;
}

export const loader: LoaderFunction = async () => {
  return json({ API_URL: process.env.API_URL || 'https://api.agify.io' });
}

export default function User() {
  const { API_URL } = useLoaderData();
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<ResultT | null>(null);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.target as typeof e.target & {
      name: HTMLInputElement
    }

    setIsSubmitting(true);
    const name = form.name.value;
    const data = await fetch(API_URL + '?name=' + name).then(re => re.json());

    setResult(data);
    setIsSubmitting(false);
  }

  return (
    <main>
      <div className="w-96 mx-auto my-5">
        <form className="w-full gap-2 flex" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Type Name"
            className="rounded border border-gray-500 px-2 py-1 text-lg w-full"
            required
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300 w-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>Submit</>
            )}
          </button>
        </form>
        {!isSubmitting && result && (
          <div className="my-2 p-1 border">
            <p>Name: {result.name}</p>
            <p>Age: {result.age?.toString() || 'N/A'}</p>
            <p>Count: {result.count?.toString()}</p>
          </div>
        )}
      </div>
    </main>
  );
}
