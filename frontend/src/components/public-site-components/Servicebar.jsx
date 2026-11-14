import { Truck, ShieldCheck, Headset, Package } from "lucide-react";

const services = [
    {
        icon: Truck,
        title: "Free Shipping",
        description: "On orders over $100",
    },
    {
        icon: ShieldCheck,
        title: "Secure Payment",
        description: "Your information is safe",
    },
    {
        icon: Headset,
        title: "24/7 Support",
        description: "We're here to help",
    },
    {
        icon: Package,
        title: "Easy Returns",
        description: "30-day return policy",
    },
];

function ServiceBar() {
    return (
        <section className="w-full bg-gray-50 border-y border-gray-200">
            <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-200">

                {services.map((service, index) => {
                    const Icon = service.icon;

                    return (
                        <div
                            key={index}
                            className="flex items-center justify-center gap-3
                            px-3 py-5 sm:py-6"
                        >
                            <Icon
                                size={25}
                                strokeWidth={1.5}
                                className="shrink-0 text-gray-700"
                            />

                            <div className="flex flex-col">
                                <h3 className="text-xs sm:text-sm font-semibold text-gray-900">
                                    {service.title}
                                </h3>

                                <p className="text-[10px] sm:text-xs text-gray-500">
                                    {service.description}
                                </p>
                            </div>
                        </div>
                    );
                })}

            </div>
        </section>
    );
}

export default ServiceBar;