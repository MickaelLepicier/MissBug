const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }
        
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        console.log('filterByToEdit: ',filterByToEdit)
        onSetFilterBy(filterByToEdit)
    }

    const { txt, minSeverity, sortBy, sortDir } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Filter</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="txt">Text: </label>
                <input value={txt} onChange={handleChange} type="text" placeholder="By Text" id="txt" name="txt" />

                <label htmlFor="minSeverity">Min Severity: </label>
                <input value={minSeverity} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />

            </form>
                {/* <h2>Sort By</h2> */}
                <select id="sortBy" name="sortBy" value={sortBy} onChange={handleChange} >
                    <option value="" >Sort By</option>
                    <option value="title" >Title</option>
                    <option value="severity" >Severity</option>
                    <option value="createdAt" >Created</option>
                </select>
                <label htmlFor="">Sort Dir:</label>
                <input type="checkbox" name="sortDir" value={sortDir} onChange={handleChange} />

            {/* TODO ADD SORT DIR with select or checkbox */}
                
        </section>
    )
}