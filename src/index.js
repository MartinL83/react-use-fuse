import { useState } from "react";
import Fuse from "fuse.js";

function fuzzySearch({ fuse, data, term }) {
  const result = fuse.search(`${term}`);
  return term ? result : data;
}

/**
 *
 * @param {*} param0
 *
 * A custom React Hook to do a in-memory fuzzy text search
 * using Fuse.js.
 */
function useFuse({ data, options }) {
  const [term, setTerm] = useState("");

  const fuseOptions = {
    threshold: 0.2,
    ...options
  };

  const fuse = new Fuse(data, fuseOptions);

  const result = fuzzySearch({ data, term, fuse });

  const reset = () => setTerm("");

  return { result, search: setTerm, term, reset };
}

export default useFuse;
