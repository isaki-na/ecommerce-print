
import CardProduct from "@/Components/Cards/CardProduct";

import SectionList from "@/Components/Sections/SectionList";

import Layout from "@/Layouts/Layout";
import { Head, usePage } from "@inertiajs/react";
import GridProduct from "@/Components/Grids/GridProduct";
import CarouselSection from "./CarouselSection";
import MetaTag from "@/Components/MetaTag";

export default function Home({
    page,
    brands,

    productsBestSeller,
  
    newProducts,

    categoriesProductCount,
}) {
    // console.log(productsBestSeller[0]);
    return (
        <>
            <MetaTag metaTag={page.metaTag} />

            <Layout>
                <div className="container">
                    

                    <SectionList title={"Categorias"}>
                        <CarouselSection
                            items={categoriesProductCount}
                            searchType="categories[]"
                        />
                    </SectionList>

                   
                    {productsBestSeller.length > 0 && (
                        <SectionList title="Los mas vendidos">
                            <GridProduct>
                                {productsBestSeller.map((product) => (
                                    <CardProduct key={product.id} product={product}
                                    />
                                ))}
                            </GridProduct>
                        </SectionList>
                    )}

                    <SectionList title={"Los recién llegados"}>
                        <div className="py-2 relative">
                            <GridProduct>
                                {newProducts.map((product) => (
                                    <CardProduct key={product.id} product={product} productNew={true} />
                                ))}
                            </GridProduct>
                        </div>
                    </SectionList>

                    
                    {brands.length > 1 && (
                        <SectionList title={"Top Marcas"}>
                            <CarouselSection items={brands} searchType="brands" />
                        </SectionList>
                    )}
                </div>
            </Layout>
        </>
    );
}
