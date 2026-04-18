import CardProduct from "@/Components/Cards/CardProduct";
import SectionList from "@/Components/Sections/SectionList";

import Layout from "@/Layouts/Layout";
// import { Head, usePage } from "@inertiajs/react";
import GridProduct from "@/Components/Grids/GridProduct";
// import CarouselSection from "./CarouselSection";
import MetaTag from "@/Components/MetaTag";
import { uniqueProductsByParent } from "@/Helpers/helpers";

export default function Home({
    page,
    productsBestSeller,
    newProducts,
    allProducts,

}) {
    // console.log(productsBestSeller[0]);
    const uniqueAllProducts = uniqueProductsByParent(allProducts);

    return (
        <>
            <MetaTag metaTag={page.metaTag} />

            <Layout>
                <div className="container">
                    <SectionList title={"Todos los productos"} hideMobileTitle>
                        <div className="py-2 relative">
                            <GridProduct>
                                {uniqueAllProducts.map((product) => (
                                    <CardProduct key={product.id} product={product} productNew={true} />
                                ))}
                            </GridProduct>
                        </div>
                    </SectionList>
                    
                </div>
            </Layout>
        </>
    );
}
