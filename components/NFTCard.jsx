import Link from "next/link";

export const NFTCard = ({ post, page }) => {
  return (
    <>
      <Link
        href={`/${page}/${post.metadata_id}`}
        className="col-xl-4 col-lg-4 col-sm-6"
      >
        <div className="nft-item home-4">
          <div className="nft-inner">
            {/* <!-- nft top part --> */}
            <div className="nft-item-top d-flex justify-content-between align-items-center">
              <div className="author-part">
                <ul className="author-list d-flex">
                  <li className="single-author d-flex align-items-center">
                    <Link href="author.html" className="veryfied">
                      <img
                        loading="lazy"
                        src="/assets/images/seller/author.jpg"
                        alt="author-img"
                      />
                    </Link>
                    <h6>
                      <a href="author.html">Allie eve knox</a>
                    </h6>
                  </li>
                </ul>
              </div>
            </div>
            {/* <!-- nft-bottom part --> */}
            <div
              className="nft-item-bottom"
              style={{ height: "360px", overflow: "hidden" }}
            >
              <div className="nft-thumb">
                <img
                  loading="lazy"
                  src={post.media ? post.media : "/no-image.png"}
                  alt="nft-img"
                  style={{ width: "100%", height: "260px" , objectFit:"contain"}}
                />
              </div>
              <div className="nft-content">
                <h4>
                  <Link href="item-details.html">{post.title}</Link>
                </h4>
                <div className="price-like d-flex justify-content-between align-items-center">
                  <p className="nft-price">
                    Description:{" "}
                    <span className="yellow-color">{post.description}</span>
                  </p>
                  {/* <a href="#" className="nft-like">
                  <i className="icofont-heart"></i> 230
                </a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};
