import { Handlers } from "$fresh/server.ts";
import axios from "axios";
import { z } from "zod";
import Try, { Failure, Success } from "fp-try";
import Toggler from "../islands/Toggler.tsx";

const schema = z.object({
  scores: z.array(
    z.object({
      username: z.string(),
      score: z.number(),
    }),
  ),
}).transform((data) => data.scores);

type Scores = z.infer<typeof schema>;

export const handler: Handlers = {
  async GET(req, ctx) {
    const result = await Try(() =>
      axios.get<unknown>(`${Deno.env.get("API_URL")}/all-scores`)
        .then(({ data }) => schema.parse(data))
    );

    return await ctx.render(result);
  },
};

export default function Home({ data: result }: { data: Failure | Success<Scores> }) {
  if (result.failure) return <div>{result.error.message}</div>;
  const data = result.data;

  const topThree = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <div className="w-screen h-screen flex flex-col justify-center gap-8 items-center bg-gray-800 text-white">
      <div className="flex flex-col items-center">
        {topThree.map(({ username, score }) => <p className="text-3xl">{username}: {score}</p>)}
        <div className="mt-4" />
        {rest.map(({ username, score }) => <p>{username}: {score}</p>)}
      </div>
      <Toggler apiUrl={Deno.env.get("API_URL")} />
    </div>
  );
}
