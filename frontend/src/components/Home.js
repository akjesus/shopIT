import React, { Fragment, useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import MetaData from "./layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions";
import Product from "../components/product/Product";
import Loader from "../components/layouts/Loader";
import { useAlert } from "react-alert";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);
const Home = () => {
  const [currentPage, setCurrentpage] = useState(1);
  const [price, setPrice] = useState([1, 1000]);
  const dispatch = useDispatch();
  const { loading, products, productCount, error, resPerPage } = useSelector(
    (state) => state.products
  );
  const { keyword } = useParams();
  if (keyword) console.log(keyword);
  useEffect(() => {
    if (error) {
      return alert.error(error);
    }
    dispatch(getProducts(keyword, currentPage, price));
  }, [dispatch, alert, error, currentPage, price]);
  function setCurrentpageNo(pageNumber) {
    setCurrentpage(pageNumber);
  }
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Buy Best Products Online"} />
          <h1 id="products_heading">Latest Products</h1>
          <section id="products" className="container mt-5">
            <div className="row">
              {products &&
                products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
            </div>
          </section>

          <div className="d-flex justify-content-center mt-5">
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={4}
              totalItemsCount={9}
              onChange={setCurrentpageNo}
              nextPageText={"Next"}
              prevPageText={"Prev"}
              firstPageText={"First"}
              lastPageText={"Last"}
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
