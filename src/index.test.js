import { renderHook, act } from "react-hooks-testing-library";
import _ from "lodash";
import { useFuzzySearch } from "./index";

// Data to pass to search
const data = [
  { id: 1, fullName: "Martin Lindgren" },
  { id: 2, fullName: "Another Person" },
  { id: 3, fullName: "More Humans" },
  { id: 4, fullName: "Second Martin" }
];

// Options to use in search
const options = {
  data,
  options: {
    keys: ["fullName", "id"]
  }
};

describe("Fuzzy search: On init", () => {
  it("Should expose correct API", () => {
    // 'result.current' will contain search api methods
    const { result } = renderHook(() => useFuzzySearch(options));

    const exposedApi = result.current;

    // Expected API to be exposed
    const expectedApi = {
      search: expect.any(Function),
      term: expect.any(String),
      reset: expect.any(Function),
      result: expect.any(Array)
    };

    // Convert both the expected API and exposed API to sorted array of strings
    // so we can compare the naming.
    const expectedApiMethods = Object.keys(expectedApi).sort();
    const exposedApiMethods = Object.keys(exposedApi).sort();

    // Check if the naming of the methods and data is correct
    expect(expectedApiMethods).toEqual(exposedApiMethods);

    // Do type checking on exposed API.
    expect(exposedApi).toMatchObject(expectedApi);
  });

  it("Should output provided input data on init", () => {
    const { result } = renderHook(() => useFuzzySearch(options));
    const output = result.current.result;

    // The initial output should be exactly the same as the input data.
    // Check the length of array.
    expect(output).toHaveLength(data.length);

    // Extract all IDs from the different arrays. And do a diff on the
    // two arrays to make sure output is identical to input.
    const inputIds = data.map(({ id }) => id);
    const outputIds = output.map(({ id }) => id);

    const diff = _.difference(inputIds, outputIds);

    // We expect a empty array because of no difference.
    expect(diff).toHaveLength(0);
  });
});

describe("Fuzzy search: When searching", () => {
  it("Should perform a search on type Number", () => {
    const { result } = renderHook(() => useFuzzySearch(options));

    // Expected data to search for. Lets grab a element by ID (1 here).
    const { id, fullName } = data.find(({ id }) => id === 1);

    // Perform a search by ID.
    act(() => {
      result.current.search(id);
    });

    // We expect one match here ny id field.
    expect(result.current.result).toHaveLength(1);

    // Since we expect one match, take the first element of output and match to expected data.
    expect(result.current.result[0]).toMatchObject({ id, fullName });
  });

  it("Should perform a search on type String", () => {
    const { result } = renderHook(() => useFuzzySearch(options));

    // Grab the expected output that we want to search for.
    const { id, fullName } = data.find(({ id }) => id === 1);

    // Perform a search on fullName
    act(() => {
      result.current.search(fullName);
    });

    // We expect one match when searching for full name.
    expect(result.current.result).toHaveLength(1);

    // And the result should match the object data we expected.
    expect(result.current.result[0]).toMatchObject({ id, fullName });
  });
  it("Should output a array with matches if several", () => {
    const { result } = renderHook(() => useFuzzySearch(options));

    const first = data.find(({ id }) => id === 1);
    const second = data.find(({ id }) => id === 4);

    const [searchTerm] = first.fullName.split(" ");

    // Perform a search on fullName
    act(() => {
      result.current.search(searchTerm);
    });

    const [firstResult, secondResult] = result.current.result.sort();

    // We expect one match when searching for full name.
    expect(result.current.result).toHaveLength(2);

    expect(firstResult).toMatchObject(first);
    expect(secondResult).toMatchObject(second);
  });

  it("Should return a empty array on empty result", () => {
    const { result } = renderHook(() => useFuzzySearch(options));

    // Do a search for a known empty result
    act(() => {
      result.current.search("**noMatch**");
    });

    // We expect no match here, so result should be a empty array
    expect(result.current.result).toHaveLength(0);

    // And the result should be of type Array.
    expect(Array.isArray(result.current.result)).toBe(true);
  });

  it("Should be able to reset to initial state", () => {
    const { result } = renderHook(() => useFuzzySearch(options));

    const { fullName } = data.find(({ id }) => id === 1);

    // Perform a search
    act(() => {
      result.current.search(fullName);
    });

    // Reset search
    act(() => {
      result.current.reset();
    });

    // Output should now be the same as the input after reset.
    expect(result.current.result).toHaveLength(data.length);
  });

  it("Should expose the current search term", () => {
    const { result } = renderHook(() => useFuzzySearch(options));

    const { fullName } = data.find(({ id }) => id === 1);

    // Search for the fullName.
    act(() => {
      result.current.search(fullName);
    });

    const currentSearchTerm = result.current.term;

    expect(currentSearchTerm).toBe(fullName);
  });
});
