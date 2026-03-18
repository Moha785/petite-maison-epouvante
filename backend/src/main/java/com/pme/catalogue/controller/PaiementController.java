package com.pme.catalogue.controller;

import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/paiement")
@CrossOrigin(origins = "*")
public class PaiementController {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @PostMapping("/create-session")
    public ResponseEntity<Map<String, String>> createSession(@RequestBody List<Map<String, Object>> articles) {
        try {
            Stripe.apiKey = stripeSecretKey;

            SessionCreateParams.Builder paramsBuilder = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl("http://localhost:3000/paiement/succes")
                    .setCancelUrl("http://localhost:3000/paiement/annule");

            for (Map<String, Object> article : articles) {
                String nom = (String) article.get("nom");
                Number prix = (Number) article.get("prix");
                Number quantite = (Number) article.get("quantite");

                long prixCentimes = (long) (prix.doubleValue() * 100);

                paramsBuilder.addLineItem(
                    SessionCreateParams.LineItem.builder()
                        .setQuantity(quantite.longValue())
                        .setPriceData(
                            SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("eur")
                                .setUnitAmount(prixCentimes)
                                .setProductData(
                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName(nom)
                                        .build()
                                )
                                .build()
                        )
                        .build()
                );
            }

            Session session = Session.create(paramsBuilder.build());
            return ResponseEntity.ok(Map.of("url", session.getUrl()));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}