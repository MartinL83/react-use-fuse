# react-use-fuse
A tiny wrapper for the Fuse.js library fuzzy-search using React Hooks.

## Example usage
```sh

const customers = [
    {id: 1, name: 'Customer A', email: 'aa@aa.com'},
    {id: 2, name: 'Customer B' email: 'mm@mm.com'}
]

function MyComponent({customers}){
    const { result, search, term, reset } = useFuse({
        data: customers,
        options: {
            keys: ["name", "email"]
        }
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