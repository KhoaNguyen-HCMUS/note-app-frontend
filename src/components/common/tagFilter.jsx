export default function TagFilter({ tags, selectedTag, onSelectTag }) {
  return (
    <div className='mb-4'>
      <h6>Lọc theo Tag:</h6>
      <div className='d-flex flex-wrap gap-2'>
        <button
          className={`btn btn-sm ${selectedTag === null ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => onSelectTag(null)}
        >
          Tất cả
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            className={`btn btn-sm ${selectedTag === tag ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => onSelectTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
