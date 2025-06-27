function SearchBar({ setSearchTerm }) {
  return (
    <input
      type="text"
      placeholder="Search products..."
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full p-2 border rounded mb-4"
    />
  );
}

export default SearchBar;