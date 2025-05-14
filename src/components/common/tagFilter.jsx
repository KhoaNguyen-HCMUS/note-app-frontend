import PropTypes from 'prop-types';

export default function TagFilter({ tags = [], selectedTag = null, onSelectTag }) {
  const uniqueTags = [...new Set(tags)];

  return (
    <div className='mb-4'>
      <h6 className='text-lg font-semibold text-gray-700 mb-3'>Filter by Tag:</h6>
      <div className='flex flex-wrap gap-2'>
        <button
          className={`cursor-pointer px-3 py-1.5 text-sm rounded-full transition-colors
            ${
              selectedTag === null ? 'bg-blue-600 text-white' : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
            }`}
          onClick={() => onSelectTag(null)}
        >
          All
        </button>
        {uniqueTags.map((tag) => (
          <button
            key={tag}
            className={`cursor-pointer px-3 py-1.5 text-sm rounded-full transition-colors
              ${
                selectedTag === tag ? 'bg-blue-600 text-white' : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
              }`}
            onClick={() => onSelectTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

TagFilter.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  selectedTag: PropTypes.string,
  onSelectTag: PropTypes.func.isRequired,
};

TagFilter.defaultProps = {
  tags: [],
  selectedTag: null,
};
