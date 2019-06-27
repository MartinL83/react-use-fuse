# react-use-fuse
A tiny wrapper for the fuzzy-search library [Fuse.js](https://fusejs.io) using React Hooks.

## Example usage
```sh

const customers = [
    {id: 1, name: 'Customer A', email: 'aa@aa.com'},
    {id: 2, name: 'Customer B' email: 'mm@mm.com'}
]

function MyComponent({customers}){

    // This is Fuse specific options. Read more at
    // https://fusejs.io/#examples
    const options = {
        keys: ["name", "email"]
    }

    // Setup the Hook.
    const { result, search, term, reset } = useFuse({
        data: customers,
        options
    });

    return (
        <div>
            <input
                onChange={e => search(e.target.value)}
                value={term}
                placeholder="Search for a customer..."
            />

            {result.map(customer => (
                <div>
                    {customer.name} - {customer.email}
                </div>
            ))}
        </div>
    )
}

<MyComponent customers={customers} />
```
