export function BugPreview({bug}) {
    
    return <article className="bug-preview">
        <p className="title">{bug.title}</p>
        <p className="description">{bug.description || "No description provided."}</p>
        <p>Severity: <span>{bug.severity}</span></p>
    </article>
}