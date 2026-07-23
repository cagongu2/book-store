import React, { useEffect, useState } from "react";
import BookCard from "../books/BookCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";

const categories = [
  "Choose a genre",
  "Business",
  "Fiction",
  "Horror",
  "Adventure",
];

const TopSellers = () => {
  const [selectedCategory, setSelectedCategory] = useState([]);

  const { data: books = [] } = useFetchAllBooksQuery();

  const filteredBooks =
    selectedCategory === "Choose a genre"
      ? books
      : books.filter(
          (book) => book.category === selectedCategory.toString().toLowerCase()
        );

  return (
    <>
      <div className="py-10">
        <h2 className="text-3xl font-semibold mb-6">Top Sellers</h2>
        {
          <div className="mb-8 flex items-center">
            <select
              onChange={(e) => setSelectedCategory(e.target.value)}
              name="category"
              id="category"
              className="border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2 focus:outline-none"
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        }
      </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        // pagination={{
        //   clickable: true,
        // }}
        navigation={true}
        modules={[Pagination, Navigation]}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 30,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 22,
            spaceBetween: 50,
          },
          1180: {
            slidesPerView: 3,
            spaceBetween: 50,
          },
        }}
        className="mySwiper"
      >
        {filteredBooks.map((book, index) => {
          return (
            <SwiperSlide key={index}>
              <BookCard book={book} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default TopSellers;
