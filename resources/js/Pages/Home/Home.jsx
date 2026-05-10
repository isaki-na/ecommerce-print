import CardProduct from "@/Components/Cards/CardProduct";
import SectionList from "@/Components/Sections/SectionList";

import Layout from "@/Layouts/Layout";
import { router } from "@inertiajs/react";
import GridProduct from "@/Components/Grids/GridProduct";
// import CarouselSection from "./CarouselSection";
import MetaTag from "@/Components/MetaTag";
import { uniqueProductsByParent } from "@/Helpers/helpers";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function Home({
    page,
    productsBestSeller,
    newProducts,
    allProducts,
    allProductsPaginated,

}) {
    const incomingProducts = useMemo(() => {
        if (Array.isArray(allProducts)) {
            return allProducts;
        }

        return allProducts?.data || [];
    }, [allProducts]);

    const [loadedProducts, setLoadedProducts] = useState(uniqueProductsByParent(incomingProducts));
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const mobileLoadMoreRef = useRef(null);

    useEffect(() => {
        const dedupedIncoming = uniqueProductsByParent(incomingProducts);

        if ((allProductsPaginated?.current_page || 1) <= 1) {
            setLoadedProducts(dedupedIncoming);
            return;
        }

        setLoadedProducts((prev) => uniqueProductsByParent([...prev, ...dedupedIncoming]));
    }, [incomingProducts, allProductsPaginated?.current_page]);

    const hasMore = Boolean(allProductsPaginated?.next_page_url);

    const handleLoadMore = useCallback(() => {
        if (!hasMore || isLoadingMore) return;

        setIsLoadingMore(true);

        router.get(allProductsPaginated.next_page_url, {}, {
            preserveScroll: true,
            preserveState: true,
            only: ["allProducts", "allProductsPaginated"],
            onFinish: () => setIsLoadingMore(false),
        });
    }, [hasMore, isLoadingMore, allProductsPaginated?.next_page_url]);

    useEffect(() => {
        const sentinel = mobileLoadMoreRef.current;
        if (!sentinel || !hasMore) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                handleLoadMore();
            },
            {
                root: null,
                rootMargin: "200px 0px",
                threshold: 0.1,
            },
        );

        observer.observe(sentinel);

        return () => observer.disconnect();
    }, [hasMore, handleLoadMore]);

    return (
        <>
            <MetaTag metaTag={page.metaTag} />

            <Layout>
                <div className="container">
                    <SectionList
                        title={"Todos los productos"}
                        hideMobileTitle
                        titleClassName="text-sm font-semibold uppercase tracking-[0.16em] text-gray-900"
                    >
                        <div className="py-2 relative">
                            <GridProduct>
                                {loadedProducts.map((product) => (
                                    <CardProduct key={product.id} product={product} productNew={true} />
                                ))}
                            </GridProduct>
                        </div>

                        {hasMore && (
                            <div className="hidden md:flex justify-center mt-8">
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleLoadMore}
                                    disabled={isLoadingMore}
                                >
                                    {isLoadingMore ? "Cargando..." : "Cargar más productos"}
                                </button>
                            </div>
                        )}

                        {hasMore && (
                            <div ref={mobileLoadMoreRef} className="md:hidden h-12 flex items-center justify-center mt-6">
                                {isLoadingMore ? <span className="text-sm text-gray-500">Cargando...</span> : null}
                            </div>
                        )}
                    </SectionList>

                </div>
            </Layout>
        </>
    );
}
