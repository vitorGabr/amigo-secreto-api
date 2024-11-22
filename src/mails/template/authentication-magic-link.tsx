import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import * as React from "react";

interface AuthenticationMagicLinkTemplateProps {
	authLink: string;
}

export default function AuthenticationMagicLinkTemplate({
	authLink,
}: AuthenticationMagicLinkTemplateProps) {
	return (
		<Html>
			<Head />
			<Preview>Acesse seu Amigo Secreto - Link Mágico de Login</Preview>
			<Tailwind>
				<Body className="bg-gray-100 font-sans">
					<Container className="mx-auto my-10 max-w-[500px] rounded-lg bg-white p-8 shadow-lg">
						<Section className="text-center">
							<Text className="text-5xl">🎁</Text>
							<Heading className="mt-4 text-2xl font-bold text-gray-800">
								Bem-vindo ao Amigo Secreto!
							</Heading>
						</Section>
						<Section className="mt-6">
							<Text className="text-gray-600">Olá! 👋</Text>
							<Text className="text-gray-600">
								Clique no botão abaixo para acessar sua conta do Amigo Secreto.
								Este link é válido por 24 horas.
							</Text>
						</Section>
						<Section className="mt-8 text-center">
							<Button
								className="inline-block rounded-lg bg-red-500 px-6 py-3 text-center text-sm font-semibold text-white no-underline hover:bg-red-600"
								href={authLink}
							>
								Acessar Amigo Secreto
							</Button>
						</Section>
						<Hr className="my-6 border-gray-200" />
						<Section>
							<Text className="text-sm text-gray-500">
								Se você não solicitou este email, pode ignorá-lo com segurança.
							</Text>
							<Text className="mt-4 text-sm text-gray-500">
								Por questões de segurança, este link funcionará apenas uma vez e
								expira em 24 horas.
							</Text>
						</Section>
						<Section className="mt-8 text-center">
							<Text className="text-xs text-gray-400">
								© 2024 Amigo Secreto. Todos os direitos reservados.
							</Text>
							<Link href="#" className="mt-2 text-xs text-gray-400 underline">
								Política de Privacidade
							</Link>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

AuthenticationMagicLinkTemplate.PreviewProps = {
	authLink: "https://pizza-shop.com/auth/magic-link?token=123456",
};
