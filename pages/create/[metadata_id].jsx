/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWallet } from "@mintbase-js/react";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

const UploadFiles = () => {
  const [nftData, setNftData] = useState();
  const [collectionImages, setCollectionImages] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const { activeAccountId } = useWallet();

  const router = useRouter();
  const metadata_id = router.query.metadata_id;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_API_KEY
  );

  useEffect(() => {
    async function fetchGraphQL(operationsDoc, operationName, variables) {
      const qureyHttpLink =
        process.env.NEXT_PUBLIC_NEAR_NETWORK === "mainnet"
          ? "https://interop-mainnet.hasura.app/v1/graphql"
          : "https://interop-testnet.hasura.app/v1/graphql";

      const result = await fetch(qureyHttpLink, {
        method: "POST",
        body: JSON.stringify({
          query: operationsDoc,
          variables: variables,
          operationName: operationName,
        }),
      });

      return await result.json();
    }

    const operations = (metadata_id) => {
    return `
      query MyQuery {
        mb_views_active_listings(
          where: {metadata_id: {_eq: "${metadata_id}"}}
          distinct_on: metadata_id
        ) {
          description
          media
          metadata_id
          price
          title
        }
      }    
    `;
    };

    async function fetchCheckNFT() {
      const { errors, data } = await fetchGraphQL(
        operations(metadata_id),
        "MyQuery",
        {}
      );
      setNftData(data.mb_views_active_listings[0]);
    }

    fetchCheckNFT();
  }, [activeAccountId]);



  const uploadFiles = async (e) => {
    let file;
    if (e.target.files) {
      setCollectionImages(e.target.files);
      file = e.target.files[0];
    }

    Array.from(e.target?.files).forEach(async (file) => {
      const { data, error } = await supabase.storage
        .from("collectionimages")
        .upload(`${metadata_id}/${file?.name}`, file);
    });
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    let imagesURL = [];

    const { data: imageList, error: imageError } = await supabase.storage
      .from("collectionimages")
      .list(`${metadata_id}`, {
        limit: 100,
        offset: 0,
      });

    await imageList?.forEach(async (image) => {
      let { data } = await supabase.storage
        .from("collectionimages")
        .getPublicUrl(`${metadata_id}/${image.name}`);
      imagesURL.push(data.publicUrl);
    });

    let formdata = {
      name: nftData.title,
      description: nftData.description,
      price: nftData.price,
      metadata_id: metadata_id,
      nftImage: nftData.media,
      connectedAccount: activeAccountId,
      files: imagesURL,
    };

    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/collection/addCollection`,
        formdata
      )
      .then((response) => {
        window.location.href = `/collection`;
        setIsUploading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const createCollection = nftData ? (
    <>
      <section
        className="profile-section padding-top padding-bottom"
        style={{ backgroundColor: "#1a203c" }}
      >
        <div className="container">
          <div className="section-wrapper">
            <div className="member-profile">
              <div className="profile-item">
                <div className="profile-cover" style={{ height: "300px" }}>
                  <img
                    src={nftData.media}
                    alt="cover-pic"
                    style={{ filter: "blur(10px)" }}
                  />
                </div>
                <div className="profile-information">
                  <div className="profile-pic">
                    <img src={nftData.media} alt="DP" />
                  </div>
                  <div className="profile-name">
                    <h2
                      style={{
                        textAlign: "left",
                        textShadow: "1px 1px 3px #1e1f21",
                      }}
                    >
                      {nftData.title}
                    </h2>
                    {/* <p>{nftData.description}</p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        className="tab-pane fade mentions-section show active"
        id="pills-personal"
        role="tabpanel"
        aria-labelledby="pills-personal-tab"
      >
        <div className="row">
          <div className="col">
            <div className="create-nft py-5 px-4 d-flex justify-content-center">
              <form className="create-nft-form col-8">
                <div className="upload-item mb-30">
                  {collectionImages ? (
                    <p>Images Added, Ready to Create Collection...</p>
                  ) : (
                    <p>PNG,JPG,JPEG,SVG,WEBP</p>
                  )}

                  <div className="custom-upload">
                    {collectionImages ? (
                      <div className="file-btn">
                        <i className="icofont-check"></i>
                        Added
                      </div>
                    ) : (
                      <div className="file-btn">
                        <i className="icofont-upload-alt"></i>
                        Upload a Images
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      name="title"
                      onChange={(e) => {
                        uploadFiles(e);
                      }}
                      multiple
                      id="form-nftImage"
                    />
                  </div>
                </div>

                {/* <div className="upload-item mb-30">
                  {collectionImages ? (
                    <p>Video Added, Ready to Create Collection...</p>
                  ) : (
                    <p>Add a single video/mp4 file </p>
                  )}

                  <div className="custom-upload">
                    {collectionImages ? (
                      <div className="file-btn">
                        <i className="icofont-check"></i>
                        Added
                      </div>
                    ) : (
                      <div className="file-btn">
                        <i className="icofont-upload-alt"></i>
                        Upload a Video
                      </div>
                    )}

                    <input
                      type="file"
                      accept="video/*	"
                      name="title"
                      onChange={(e) => {
                        uploadFiles(e);
                      }}
                      multiple
                      id="form-nftImage"
                    />
                  </div>
                </div> */}
                <div className="submit-btn-field text-center">
                  {isUploading ? (
                    <button type="submit">Uploading...</button>
                  ) : (
                    <button
                      type="submit"
                      id="btn-upload-file"
                      onClick={(e) => handleCreateCollection(e)}
                    >
                      Create Collection
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <section className="page-header-section style-1 vh-100">
      <div className="container">
        <div className="page-header-content">
          <div className="page-header-inner">
            <div className="page-title">
              <h2>Loading... </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  return createCollection;
};

export default UploadFiles;
